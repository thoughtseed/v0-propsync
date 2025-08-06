# Propsync - Property Management Platform

> A modern, secure property management application built with Next.js 14, Supabase, and TypeScript.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com/thoughtseedlabs-projects/v0-propsync)

## 🏠 Overview

Propsync is a comprehensive property management platform designed for property managers, landlords, and real estate professionals. It provides a secure, user-friendly interface for managing property portfolios with detailed property information, safety features, and accessibility considerations.

### ✨ Key Features

- **🔐 Secure Authentication** - Supabase Auth with Row Level Security (RLS)
- **📝 Multi-Step Property Wizard** - Comprehensive property data collection across 8 categories
- **💾 Auto-Save Functionality** - Never lose your progress with debounced auto-save
- **🎨 Modern UI/UX** - Built with Radix UI and shadcn/ui components
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🔒 Data Security** - User-scoped data access with automatic isolation
- **⚡ Type Safety** - End-to-end TypeScript with Zod validation
- **🚀 Performance Optimized** - Server Components and optimized data fetching

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js Server Actions, Supabase
- **Database**: PostgreSQL (Supabase) with Row Level Security
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Development**: v0.dev for rapid prototyping

### Key Architectural Decisions

- **Server Actions over REST APIs** - Type-safe, CSRF-protected server operations
- **Hybrid Database Design** - Normalized tables + JSONB for complex property data
- **Row Level Security** - Automatic data isolation between users
- **Multi-Step Wizard Pattern** - Enhanced UX for complex data entry
- **Component-Based Architecture** - Reusable, accessible UI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd v0-propsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   
   **Option A: Supabase Dashboard**
   - Create a new Supabase project
   - Run the SQL from `lib/supabase/setup.sql` in the SQL editor
   
   **Option B: Supabase CLI**
   ```bash
   npx supabase login
   npx supabase init
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Visit [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[Development Setup Guide](./DEVELOPMENT_SETUP.md)** - Detailed setup instructions
- **[Architecture Documentation](./ARCHITECTURE.md)** - Key architectural decisions
- **[API Documentation](./API_DOCUMENTATION.md)** - Server actions and data flow

## 🏢 Property Management Features

### Property Data Categories

1. **🏠 Basic Information**
   - Property reference, building name, unit details
   - Property type, size, and basic specifications

2. **🔒 Safety & Security**
   - Fire safety equipment, security systems
   - Emergency procedures and contact information

3. **🍳 Kitchen & Dining**
   - Appliances, utensils, dining arrangements
   - Kitchen equipment and amenities

4. **🛏️ Bedrooms & Bathrooms**
   - Bed configurations, bathroom facilities
   - Linens, towels, and personal care items

5. **💻 Technology**
   - WiFi details, entertainment systems
   - Smart home features and connectivity

6. **🏡 Practical Living**
   - Cleaning supplies, maintenance tools
   - Utility information and practical amenities

7. **📍 Location & Lifestyle**
   - Transportation, local amenities
   - Neighborhood information and attractions

8. **♿ Accessibility & Sustainability**
   - Accessibility features, eco-friendly amenities
   - Sustainability initiatives and green features

### User Roles & Permissions

- **Property Managers** - Full access to their property portfolio
- **Readonly Users** - View-only access to assigned properties
- **Admins** - System administration and user management

## 🔐 Security Features

### Authentication & Authorization

- **Supabase Authentication** - Secure email/password authentication
- **Row Level Security (RLS)** - Database-level data isolation
- **Middleware Protection** - Route-level access control
- **Session Management** - Automatic session refresh and validation

### Data Security

- **User-Scoped Data** - Users can only access their own properties
- **Encrypted Sensitive Data** - WiFi passwords and access codes
- **CSRF Protection** - Built-in with Server Actions
- **Type-Safe Operations** - Zod validation for all inputs

## 🎨 UI/UX Features

### Design System

- **Consistent Theming** - Custom Tailwind configuration
- **Dark Mode Support** - System preference detection
- **Accessible Components** - WCAG compliant UI elements
- **Responsive Design** - Mobile-first approach

### User Experience

- **Multi-Step Wizard** - Guided property data entry
- **Auto-Save** - Progress preservation with debouncing
- **Toast Notifications** - User feedback for all actions
- **Loading States** - Clear progress indicators
- **Error Handling** - Graceful error recovery

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npx supabase start   # Start local Supabase
npx supabase stop    # Stop local Supabase
npx supabase db reset # Reset database
```

### Project Structure

```
v0-propsync/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Protected routes
│   ├── actions/           # Server Actions
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── property/         # Property management
│   ├── ui/               # shadcn/ui components
│   └── wizard/           # Multi-step wizard
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase configuration
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
├── types/                # TypeScript definitions
└── public/               # Static assets
```

### Key Development Patterns

1. **Server Actions** - Type-safe server operations
   ```typescript
   export async function createProperty(formData: WizardFormData) {
     // Server-side logic with automatic CSRF protection
   }
   ```

2. **Multi-Step Wizard** - Context-based state management
   ```typescript
   const { currentStep, formData, updateFormData } = useWizard()
   ```

3. **Type Safety** - End-to-end TypeScript
   ```typescript
   const propertySchema = z.object({
     property_reference: z.string().min(1),
     building_name: z.string().min(1),
     // ... more validations
   })
   ```

## 🚀 Deployment

### Live Application

**Production**: [https://vercel.com/thoughtseedlabs-projects/v0-propsync](https://vercel.com/thoughtseedlabs-projects/v0-propsync)

**v0.dev Project**: [https://v0.dev/chat/projects/xd8YjdPI0QO](https://v0.dev/chat/projects/xd8YjdPI0QO)

### Vercel Deployment

1. **Connect Repository**
   - Import project to Vercel
   - Configure environment variables

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_production_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
   ```

3. **Deploy**
   ```bash
   npm run build
   # Automatic deployment on git push
   ```

### Database Migration

```bash
# Production database setup
npx supabase db push
npx supabase db seed
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Standards

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Conventional Commits** - Standardized commit messages

## 📊 Performance

### Optimization Features

- **Server Components** - Reduced client-side JavaScript
- **Automatic Code Splitting** - Optimized bundle sizes
- **Image Optimization** - Next.js Image component
- **Database Indexing** - Optimized query performance
- **Caching Strategy** - Strategic cache invalidation

### Performance Metrics

- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Cumulative Layout Shift** - < 0.1
- **Time to Interactive** - < 3.5s

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check environment variables
   echo $NEXT_PUBLIC_SUPABASE_URL
   
   # Verify Supabase project status
   npx supabase status
   ```

2. **Authentication Problems**
   ```bash
   # Reset auth tables
   npx supabase db reset
   
   # Check RLS policies
   # Visit Supabase Dashboard > Authentication > Policies
   ```

3. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

- **Documentation** - Check the docs folder
- **Issues** - Create a GitHub issue
- **Discussions** - Join community discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Supabase Team** - Excellent backend-as-a-service
- **Vercel Team** - Seamless deployment platform
- **shadcn** - Beautiful UI components
- **Radix UI** - Accessible component primitives
- **v0.dev** - Rapid prototyping and development

---

**Built with ❤️ using modern web technologies**

For detailed setup instructions, see [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

For architectural insights, see [ARCHITECTURE.md](./ARCHITECTURE.md)

For API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
