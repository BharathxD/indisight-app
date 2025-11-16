# Architecture Documentation

## Overview

IndiSight is a modern CMS platform built with Next.js, TypeScript, and PostgreSQL. The architecture is designed to be extensible, allowing for future enhancements like engagement features, video content, events, and monetization without major rewrites.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (App Router)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ tRPC  │ │ Pages │
│ API   │ │ (SSR) │
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Prisma ORM)  │
└─────────────────┘
         │
┌────────▼────────┐
│  Cloudflare R2  │
│  (File Storage) │
└─────────────────┘
```

## Technology Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible primitives
- **Tiptap** - Rich text editor
- **TanStack Query** - Server state management
- **Motion (Framer Motion)** - Animations

### Backend

- **tRPC** - End-to-end type-safe APIs
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **Better Auth** - Authentication and authorization

### Infrastructure

- **Cloudflare R2** - Object storage for media files
- **Vercel** - Hosting platform (planned)

## Project Structure

### Directory Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public route group
│   │   ├── page.tsx       # Homepage
│   │   ├── articles/      # Article pages
│   │   ├── authors/       # Author pages
│   │   ├── categories/    # Category pages
│   │   └── layout.tsx     # Public layout
│   ├── admin/             # Admin route group
│   │   ├── page.tsx       # Admin dashboard
│   │   ├── articles/      # Article management
│   │   ├── authors/       # Author management
│   │   └── layout.tsx     # Admin layout
│   └── api/               # API routes
│       ├── trpc/          # tRPC handler
│       ├── auth/          # Auth callbacks
│       └── og/            # OG image generation
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── public/           # Public-facing components
│   ├── ui/               # Reusable UI components
│   └── seo/              # SEO components
├── db/                    # Database
│   ├── schema/           # Prisma schema files
│   └── migrations/      # Database migrations
├── trpc/                 # tRPC setup
│   ├── routers/         # API route handlers
│   ├── server.ts        # tRPC server setup
│   └── client.ts        # tRPC client setup
├── lib/                  # Utility functions
├── auth/                 # Auth configuration
└── hooks/                # Custom React hooks
```

## Database Schema

### Core Models

#### User (Authentication)
- Handles authentication via Better Auth
- Roles: SUPER_ADMIN, EDITOR, VIEWER
- Linked to Author model (optional)

#### Author
- Separate from User (supports guest contributors)
- Optional `userId` link for authenticated authors
- Tracks article count and featured status

#### Article
- Content stored as Tiptap JSON
- Status workflow: DRAFT → REVIEW → PUBLISHED → ARCHIVED
- SEO fields: meta title, description, keywords
- Featured/trending flags
- View counter and read time

#### Category
- Hierarchical structure (parent_id)
- Display order for sorting
- SEO metadata per category

#### Tag
- Cross-category organization
- Usage count and trending status

#### Person
- Profiles for people featured in articles
- Separate from Author (people can be subjects)

### Relationships

- **Article ↔ Author:** Many-to-many (via ArticleAuthor)
- **Article ↔ Category:** Many-to-many (via ArticleCategory)
- **Article ↔ Tag:** Many-to-many (via ArticleTag)
- **Article ↔ Person:** Many-to-many (via ArticlePerson)
- **Article ↔ Article:** Related articles (via ArticleRelated)

## API Architecture

### tRPC Routers

The API is organized into logical routers:

- **health** - Health check endpoint
- **cms** - Core CMS operations
  - `article` - Article CRUD
  - `author` - Author management
  - `category` - Category management
  - `tag` - Tag management
  - `user` - User management
  - `person` - Person profiles
- **file** - File upload/download operations
- **analytics** - Analytics and statistics
- **user** - User-specific operations

### Type Safety

tRPC provides end-to-end type safety:
- Server procedures are typed
- Client automatically infers types
- No manual API client generation needed

## Authentication & Authorization

### Better Auth Integration

- Email/password authentication
- Session management
- Password reset functionality
- Role-based access control

### Authorization Flow

```typescript
// Protected procedure example
protectedProcedure
  .input(z.object({ ... }))
  .query(async ({ ctx, input }) => {
    // ctx.user contains authenticated user
    // ctx.user.role determines permissions
  })
```

### Role Permissions

- **SUPER_ADMIN:** Full access to all resources
- **EDITOR:** Content creation and management
- **VIEWER:** Read-only access

## File Storage

### Cloudflare R2 Integration

- Direct uploads from client
- Presigned URLs for secure access
- Image optimization handled by Next.js
- Support for multiple file types

### File Upload Flow

1. Client requests presigned URL from tRPC
2. Client uploads directly to R2
3. Server stores file metadata in database
4. Files served via CDN

## SEO Architecture

### Meta Tags

- Dynamic meta tags per page
- Open Graph tags
- Twitter Card support
- Structured data (JSON-LD)

### OG Image Generation

- Dynamic OG images via `/api/og`
- Includes article title, author, category
- Generated on-demand for performance

### Sitemap & Robots

- Dynamic sitemap generation
- Robots.txt configuration
- RSS feed support

## State Management

### Server State (TanStack Query)

- All API calls via tRPC use React Query
- Automatic caching and refetching
- Optimistic updates where applicable

### Client State

- React hooks for local state
- URL state via `nuqs` for filters/search
- Theme state via `next-themes`

## Performance Optimizations

### Next.js Features

- Server Components by default
- Static generation where possible
- Image optimization
- Font optimization

### Database

- Indexed queries for common operations
- Denormalized counters (viewCount, articleCount)
- Efficient relationship queries

### Caching

- React Query caching
- Next.js static generation
- CDN caching for static assets

## Security

### Authentication

- Secure password hashing
- Session management
- CSRF protection

### Authorization

- Role-based access control
- Route-level protection
- Procedure-level checks

### Data Validation

- Zod schemas for all inputs
- Type-safe database queries
- SQL injection prevention via Prisma

## Extensibility Points

### Future Features Ready

- **Engagement:** Like/comment fields in schema
- **Video:** Media library supports multiple types
- **Events:** Category hierarchy supports event categories
- **Monetization:** Payment hooks ready in schema
- **Analytics:** Analytics router structure in place

### Adding New Features

1. Add Prisma schema changes
2. Create tRPC router/procedures
3. Build admin UI components
4. Add public-facing pages
5. Update SEO metadata

## Development Workflow

### Code Organization

- Feature-based component organization
- Shared utilities in `lib/`
- Type definitions co-located
- No barrel exports for better tree-shaking

### Code Quality

- TypeScript strict mode
- Biome for linting/formatting
- Pre-commit hooks (recommended)

## Deployment Architecture

### Production Setup

- **Hosting:** Vercel (Next.js optimized)
- **Database:** Neon.tech or PlanetScale
- **Storage:** Cloudflare R2
- **CDN:** Vercel Edge Network

### Environment Variables

All environment variables validated via `@t3-oss/env-core`:
- Type-safe environment access
- Runtime validation
- Clear error messages for missing vars

## Monitoring & Analytics

### Current

- Google Analytics integration (optional)
- View counters on articles
- Basic analytics router

### Future

- GA4 custom events
- Performance monitoring
- Error tracking
- User behavior analytics

