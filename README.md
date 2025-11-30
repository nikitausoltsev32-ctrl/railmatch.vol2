# RailMatch Vol. 2

A rail transportation requests and bidding platform built with Next.js, TypeScript, and Supabase.

## Features

- **Executor Dashboard**: Feed of open requests with filters (wagon type, date)
- **Bidding System**: Submit private bids with amount and message, edit/cancel own bids
- **Real-time Chat**: Chat panel using Supabase Realtime for live messaging
- **Permission System**: Row-level security ensuring users only see their own data
- **Status Management**: Automatic chat creation when bids are accepted

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Supabase Realtime subscriptions

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

1. Copy the environment variables template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:[password]@localhost:5432/railmatch"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

   # Next.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

### Database Setup

1. Run the database migration:
   ```bash
   npx prisma db push
   ```

2. Apply the RLS policies in Supabase SQL editor:
   ```sql
   -- Copy contents of prisma/rls_policies.sql
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main entities:

- **Users**: Profiles with roles (OWNER/EXECUTOR)
- **Requests**: Transportation requests with details like route, wagon type, date
- **Bids**: Offers made by executors with amount and message
- **Chats**: Real-time messaging between request owners and executors
- **Messages**: Individual chat messages with delivery status

## Key Features Implementation

### Real-time Chat
- Uses Supabase Realtime subscriptions
- Automatic message delivery and read receipts
- Chat creation on bid acceptance

### Security
- Row Level Security (RLS) policies
- User-based data access control
- Secure authentication with Supabase Auth

### Bidding System
- Private bids with amount and optional message
- Edit/cancel functionality for own bids
- Status tracking (PENDING, ACCEPTED, REJECTED, CANCELLED)

## Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## License

MIT License