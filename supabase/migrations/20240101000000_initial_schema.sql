-- Initial schema for railmatch.vol2
-- Creates profiles, requests, bids, and messages tables with proper relations and RLS

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for enums
CREATE TYPE user_role AS ENUM ('shipper', 'carrier', 'admin');
CREATE TYPE request_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Profiles table - stores user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'shipper',
  company_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Requests table - job postings for cargo transport
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  cargo_description TEXT NOT NULL,
  cargo_weight DECIMAL(10, 2), -- in tons
  wagon_type TEXT NOT NULL, -- e.g., 'covered', 'open', 'tank', 'refrigerated'
  wagon_count INTEGER NOT NULL DEFAULT 1,
  loading_date DATE NOT NULL,
  unloading_date DATE,
  target_price DECIMAL(10, 2), -- in local currency
  status request_status NOT NULL DEFAULT 'open',
  additional_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Bids table - offers from carriers for requests
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL, -- bid price
  notes TEXT,
  status bid_status NOT NULL DEFAULT 'pending',
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(request_id, owner_id) -- One bid per carrier per request
);

-- Messages table - communications related to bids and requests
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT check_message_target CHECK (
    (bid_id IS NOT NULL AND request_id IS NULL) OR 
    (bid_id IS NULL AND request_id IS NOT NULL)
  )
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Requests: Public read access, shippers can create/update their own
CREATE POLICY "Requests are publicly viewable" ON requests
  FOR SELECT USING (true);

CREATE POLICY "Shippers can create requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = shipper_id);

CREATE POLICY "Shippers can update own requests" ON requests
  FOR UPDATE USING (auth.uid() = shipper_id);

-- Bids: Users can only see bids they own or bids on their requests
CREATE POLICY "Users can view own bids and bids on their requests" ON bids
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    auth.uid() = (SELECT shipper_id FROM requests WHERE id = request_id)
  );

CREATE POLICY "Carriers can create bids" ON bids
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Bid owners can update their bids" ON bids
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Request owners can update bid status" ON bids
  FOR UPDATE USING (
    auth.uid() = (SELECT shipper_id FROM requests WHERE id = request_id) AND
    status IN ('accepted', 'rejected')
  );

-- Messages: Users can only see messages they sent or received
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR
    (bid_id IS NOT NULL AND (
      auth.uid() = (SELECT owner_id FROM bids WHERE id = bid_id) OR
      auth.uid() = (SELECT shipper_id FROM requests WHERE id = (SELECT request_id FROM bids WHERE id = bid_id))
    )) OR
    (request_id IS NOT NULL AND auth.uid() = (SELECT shipper_id FROM requests WHERE id = request_id))
  );

CREATE POLICY "Users can create messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Message recipients can mark as read" ON messages
  FOR UPDATE USING (
    auth.uid() != sender_id AND
    (read_at IS NULL OR read_at IS NOT NULL) -- Allow updating read_at
  );

-- Create indexes for better performance
CREATE INDEX idx_requests_shipper_id ON requests(shipper_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_loading_date ON requests(loading_date);
CREATE INDEX idx_bids_request_id ON bids(request_id);
CREATE INDEX idx_bids_owner_id ON bids(owner_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_messages_bid_id ON messages(bid_id);
CREATE INDEX idx_messages_request_id ON messages(request_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();