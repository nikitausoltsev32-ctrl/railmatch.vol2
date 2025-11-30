-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Everyone can view requests
CREATE POLICY "Requests are viewable by everyone" ON requests
    FOR SELECT USING (true);

-- Only authenticated users can create requests
CREATE POLICY "Authenticated users can create requests" ON requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Request creators can update their own requests
CREATE POLICY "Request creators can update own requests" ON requests
    FOR UPDATE USING (created_by = auth.uid());

-- Users can view bids for requests they created or bids they made
CREATE POLICY "Users can view relevant bids" ON bids
    FOR SELECT USING (
        created_by_id = auth.uid() OR 
        request_id IN (
            SELECT id FROM requests WHERE created_by = auth.uid()
        )
    );

-- Users can create bids on open requests
CREATE POLICY "Users can create bids" ON bids
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        created_by_id = auth.uid() AND
        request_id IN (
            SELECT id FROM requests WHERE status = 'OPEN'
        )
    );

-- Bid creators can update their own bids
CREATE POLICY "Bid creators can update own bids" ON bids
    FOR UPDATE USING (created_by_id = auth.uid());

-- Users can view chats they participate in
CREATE POLICY "Users can view own chats" ON chats
    FOR SELECT USING (
        id IN (
            SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()
        )
    );

-- Users can view chat participants for chats they participate in
CREATE POLICY "Users can view chat participants" ON chat_participants
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()
        )
    );

-- Users can view messages for chats they participate in
CREATE POLICY "Users can view chat messages" ON messages
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()
        )
    );

-- Users can send messages to chats they participate in
CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        sender_id = auth.uid() AND
        chat_id IN (
            SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()
        )
    );

-- Function to create chat when bid is accepted
CREATE OR REPLACE FUNCTION create_chat_for_accepted_bid()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ACCEPTED' AND OLD.status != 'ACCEPTED' THEN
        INSERT INTO chats (bid_id, request_id)
        VALUES (NEW.id, NEW.request_id);
        
        -- Add both parties to chat participants
        INSERT INTO chat_participants (chat_id, user_id)
        SELECT 
            (SELECT id FROM chats WHERE bid_id = NEW.id),
            NEW.created_by_id
        UNION
        SELECT 
            (SELECT id FROM chats WHERE bid_id = NEW.id),
            r.created_by
        FROM requests r
        WHERE r.id = NEW.request_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create chat when bid is accepted
CREATE TRIGGER trigger_create_chat_on_bid_acceptance
    AFTER UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION create_chat_for_accepted_bid();