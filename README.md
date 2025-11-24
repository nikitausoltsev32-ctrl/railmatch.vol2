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
