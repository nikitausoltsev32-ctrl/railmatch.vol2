# RailMatch Vol. 2

A logistics platform connecting shippers and carriers for rail cargo transport, built with Supabase and modern web technologies.

## Overview

RailMatch is a B2B platform that facilitates the connection between companies needing to transport cargo by rail (shippers) and rail transport providers (carriers). The platform allows shippers to post cargo requests and carriers to submit competitive bids.

## Tech Stack

- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Backend**: Supabase (Authentication, Database, Storage)
- **Frontend**: Next.js 14 with TypeScript
- **Language**: TypeScript

## Database Schema

### Core Tables

#### `profiles`
User profiles with role-based access control.
- **Columns**: `id`, `email`, `full_name`, `role`, `company_name`, `phone`, timestamps
- **Roles**: `shipper`, `carrier`, `admin`
- **Access**: Users can only view/edit their own profile; admins can view all

#### `requests`
Cargo transport requests posted by shippers.
- **Columns**: `id`, `shipper_id`, `route_from`, `route_to`, `cargo_description`, `cargo_weight`, `wagon_type`, `wagon_count`, `loading_date`, `unloading_date`, `target_price`, `status`, `additional_requirements`, timestamps
- **Status**: `open`, `in_progress`, `completed`, `cancelled`
- **Access**: Public read access, shippers can create/update their own requests

#### `bids`
Competitive bids submitted by carriers for specific requests.
- **Columns**: `id`, `request_id`, `owner_id`, `amount`, `notes`, `status`, `valid_until`, timestamps
- **Status**: `pending`, `accepted`, `rejected`, `withdrawn`
- **Access**: Users can see their own bids and bids on their requests; carriers can create bids, shippers can accept/reject

#### `messages`
Communication between users related to bids and requests.
- **Columns**: `id`, `bid_id`, `request_id`, `sender_id`, `body`, `read_at`, timestamps
- **Access**: Users can only see messages they sent or received (bid participants or request owner)

### Relationships

```
profiles (1) ←→ (N) requests (shipper_id)
profiles (1) ←→ (N) bids (owner_id)
requests (1) ←→ (N) bids (request_id)
bids (1) ←→ (N) messages (bid_id)
requests (1) ←→ (N) messages (request_id)
profiles (1) ←→ (N) messages (sender_id)
```

## Security Model

The platform implements Row Level Security (RLS) with the following policies:

- **Public Data**: Requests are publicly readable to create an open job market
- **Private Data**: Bids and messages are restricted to participants only
- **Role-Based Access**: Different permissions for shippers, carriers, and admins
- **Ownership**: Users can only modify their own data unless they have admin privileges

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd railmatch.vol2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Supabase project credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Set up the database**
   
   If you're starting fresh:
   ```bash
   # Push the initial schema to your Supabase project
   npm run db:push
   ```
   
   Or if you need to reset:
   ```bash
   npm run db:reset
   ```

5. **Generate TypeScript types**
   ```bash
   npm run db:generate-types
   ```

### Development

```bash
# Start the development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## Database Management

### Migration Commands

```bash
# Push local changes to remote database
npm run db:push

# Reset database to match local schema
npm run db:reset

# Show differences between local and remote
npm run db:diff

# Generate TypeScript types from database schema
npm run db:generate-types
```

### Schema Changes

1. Create new migration files in `supabase/migrations/`
2. Use timestamp naming convention: `YYYYMMDDHHMMSS_description.sql`
3. Test locally with `npm run db:diff`
4. Apply changes with `npm run db:push`

## API Usage

The Supabase client is pre-configured in `lib/supabase.ts` with TypeScript types:

```typescript
import { supabase, Database, Profile, Request } from '@/lib/supabase'

// Example: Fetch public requests
const { data: requests, error } = await supabase
  .from('requests')
  .select('*')
  .eq('status', 'open')

// Example: Create a new request
const { data: newRequest, error } = await supabase
  .from('requests')
  .insert({
    shipper_id: userId,
    route_from: 'Berlin',
    route_to: 'Hamburg',
    cargo_description: 'Electronics',
    wagon_type: 'covered',
    wagon_count: 2,
    loading_date: '2024-02-01'
  })
```

## Project Structure

```
railmatch.vol2/
├── lib/
│   ├── supabase.ts          # Supabase client and types
│   └── database.types.ts    # Generated TypeScript types
├── supabase/
│   ├── migrations/          # Database migration files
│   └── config.json          # Supabase configuration
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Key Features

### For Shippers
- Post cargo transport requests with detailed specifications
- Browse and compare competitive bids from carriers
- Communicate directly with carriers through messages
- Track request status from open to completion

### For Carriers
- Browse available cargo requests in real-time
- Submit competitive bids with detailed proposals
- Communicate with shippers to clarify requirements
- Manage bid status and track accepted contracts

### For Platform Administrators
- User management and role assignment
- Monitor platform activity and transactions
- Resolve disputes and provide support
- Access comprehensive analytics and reporting

## Security Considerations

- **Row Level Security**: All database access is controlled by RLS policies
- **Authentication**: Supabase Auth handles user authentication securely
- **Input Validation**: Database constraints and application-level validation
- **Privacy**: Private data (bids, messages) is only accessible to authorized participants
- **Audit Trail**: Automatic timestamps track all data changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test database changes with migration commands
5. Submit a pull request

## License

[Add your license information here]
# B2B Platform - Next.js 15 with TypeScript & Tailwind CSS

A modern, scalable B2B platform built with Next.js 15, TypeScript, Tailwind CSS, and industrial design principles.

## Features

- **Next.js 15 App Router** - Latest Next.js version with App Router
- **TypeScript** - Full type safety and better developer experience
- **Tailwind CSS 4** - Utility-first CSS framework with industrial theme
- **Lucide React** - Beautiful, consistent icon library
- **ESLint & Prettier** - Code quality and formatting
- **Russian Language Support** - Full Cyrillic font support
- **Dark Mode** - Built-in dark mode support
- **Responsive Design** - Mobile-first approach
- **Industrial B2B Design** - Professional, modern aesthetic

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles and theme
├── components/
│   ├── Navigation.tsx      # Top navigation with mobile menu
│   ├── Hero.tsx           # Hero section with role-based CTAs
│   └── Footer.tsx         # Footer with links
├── lib/                   # Utility functions and helpers
├── public/                # Static assets
├── .env.example           # Environment variables template
├── tailwind.config.ts     # Tailwind CSS configuration
├── .prettierrc.json       # Prettier configuration
└── package.json           # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_key
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

### `npm run dev`

Runs the development server on [http://localhost:3000](http://localhost:3000)

### `npm run build`

Builds the application for production in the `.next` folder

### `npm run start`

Starts the production server

### `npm run lint`

Runs ESLint to check for code quality issues

### `npm run lint:fix`

Automatically fixes ESLint issues

### `npm run format`

Formats code with Prettier

### `npm run format:check`

Checks if code is formatted correctly

## Tailwind CSS Theme

The theme includes:

- **Color Palette**: Industrial slate, steel, and professional blue tones
- **Dark Mode**: Full dark mode support with CSS variables
- **Typography**: Modern font weights and sizes
- **Spacing**: Consistent spacing scale
- **Shadows**: Professional shadow system
- **Border Radius**: Balanced radius system

### Color Variables

- `--background` - Main background color
- `--foreground` - Main text color
- `--muted-background` - Secondary background
- `--muted-foreground` - Secondary text
- `--border` - Border color
- `--accent-primary` - Primary action color
- `--accent-success` - Success state
- `--accent-warning` - Warning state
- `--accent-error` - Error state

## Components

### Navigation

Responsive navigation with mobile menu. Includes:

- Logo/Brand
- Navigation links
- Mobile hamburger menu
- Dark mode support

### Hero

Landing page hero section featuring:

- Gradient headline
- Role-based CTA cards (Руководитель, Менеджер, Специалист)
- Primary call-to-action button
- Statistics grid

### Footer

Comprehensive footer with:

- Brand information
- Link sections
- Social media links
- Copyright notice

## Styling

All styles use Tailwind CSS with a custom industrial B2B theme. The design system includes:

- Consistent color palette
- Professional typography
- Smooth transitions and interactions
- Responsive breakpoints (sm, md, lg, xl, 2xl)
- Accessibility considerations

## Environment Variables

See `.env.example` for all required environment variables.

### Supabase Keys

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key for client-side authentication
- `SUPABASE_SERVICE_ROLE_KEY` - (Optional) Service role key for server-side operations

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Lucide Icons](https://lucide.dev)
- [Supabase Documentation](https://supabase.com/docs)

## License

MIT
