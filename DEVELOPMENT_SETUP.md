# Propsync Development Setup Guide

This guide will help you set up the Propsync property management application for local development.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase account** (free tier available)

## Technology Stack

- **Frontend**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Language**: TypeScript

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd v0-propsync
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: For admin operations
SUPABASE_JWT_SECRET=your_jwt_secret
```

### 4. Supabase Database Setup

#### Option A: Using Supabase Dashboard
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `lib/supabase/setup.sql`
4. Run the SQL script to create all necessary tables and policies

#### Option B: Using Supabase CLI (Advanced)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Database Schema Overview

The application uses a hybrid approach with normalized tables and JSONB columns:

### Core Tables
- **users**: User profiles with role-based access
- **properties**: Main property information with JSONB sections for:
  - `safety_security`: Safety and security features
  - `kitchen_dining`: Kitchen and dining amenities
  - `bedrooms_bathrooms`: Room details
  - `technology`: Tech features and connectivity
  - `practical_living`: Practical amenities
  - `location_lifestyle`: Location and lifestyle features
  - `accessibility_sustainability`: Accessibility and eco features

### Key Features
- **Row Level Security (RLS)**: Automatic data isolation per user
- **UUID Primary Keys**: For better security and scalability
- **Automatic Timestamps**: Created/updated tracking
- **JSONB Storage**: Flexible schema for property features

## Project Structure

```
v0-propsync/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes (requires auth)
│   │   ├── properties/          # Property management pages
│   │   └── layout.tsx           # Protected layout with auth check
│   ├── auth/                    # Authentication pages
│   ├── actions/                 # Server actions
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   ├── property/                # Property-specific components
│   └── wizard/                  # Multi-step form components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── supabase/               # Supabase configuration
│   ├── types/                  # TypeScript type definitions
│   └── utils.ts                # Utility functions
└── public/                      # Static assets
```

## Key Development Patterns

### 1. Server Actions
The app uses Next.js Server Actions for data mutations:
```typescript
// app/actions/property-actions.ts
export async function createProperty(formData: FormData) {
  // Server-side property creation logic
}
```

### 2. Multi-Step Wizard
Property creation uses a context-based wizard pattern:
```typescript
// components/wizard/wizard-context.tsx
const WizardProvider = ({ children }) => {
  // Wizard state management
}
```

### 3. Type Safety
Full TypeScript integration with Supabase:
```typescript
// lib/types/supabase.ts
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: Property
        Insert: PropertyInsert
        Update: PropertyUpdate
      }
    }
  }
}
```

## Authentication Flow

1. **Middleware**: Checks authentication on protected routes
2. **Server Components**: Use `getServerSupabaseClient()` for server-side auth
3. **Client Components**: Use `getSupabaseClient()` for client-side auth
4. **Row Level Security**: Automatic data isolation per authenticated user

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:types     # Generate TypeScript types from Supabase
npm run db:reset     # Reset local database (if using local Supabase)
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | Optional |
| `SUPABASE_JWT_SECRET` | JWT secret for token verification | Optional |

## Common Issues & Solutions

### 1. Supabase Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure RLS policies are properly configured

### 2. Authentication Problems
- Clear browser cookies and localStorage
- Check that auth redirects are configured in Supabase
- Verify middleware configuration

### 3. Database Schema Issues
- Run the setup.sql script completely
- Check that all tables have proper RLS policies
- Verify UUID extension is enabled

### 4. Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## Deployment

The application is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the existing patterns
3. Test thoroughly with different user roles
4. Submit a pull request with clear description

## Support

For development issues:
1. Check this setup guide
2. Review the `ARCHITECTURE.md` for design decisions
3. Check Supabase documentation for database issues
4. Review Next.js documentation for framework issues

---

**Note**: This application uses v0.dev for UI components and is automatically synced with deployments. The codebase follows modern React patterns with Server Components and Server Actions for optimal performance.