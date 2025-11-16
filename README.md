# IndiSight Article Management Platform

A modern CMS platform for managing editorial content, built with Next.js, TypeScript, and PostgreSQL.

## Quick Start

```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[README.md](./docs/README.md)** - Documentation index and quick start
- **[PRD.md](./docs/PRD.md)** - Product Requirements Document
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture
- **[API.md](./docs/API.md)** - API documentation
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Development guide
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment guide

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **API:** tRPC for type-safe APIs
- **Authentication:** Better Auth
- **File Storage:** Cloudflare R2
- **UI:** shadcn/ui + Radix UI + Tailwind CSS
- **Rich Text Editor:** Tiptap

## Features

- ✅ Article management with rich text editor
- ✅ Author profiles and management
- ✅ Category and tag system
- ✅ Featured and trending articles
- ✅ SEO optimization
- ✅ Search functionality
- ✅ Role-based access control
- ✅ Media library with Cloudflare R2

## Environment Setup

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/indisight"
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_BUCKET="your-bucket-name"
CLOUDFLARE_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-key"
NEXT_PUBLIC_CLOUDFLARE_R2_URL="https://your-bucket.r2.cloudflarestorage.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SIGNUP_ENABLED="false"
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm format` - Format code
- `pnpm typecheck` - Type check
- `pnpm db:push` - Push database schema
- `pnpm db:migrate` - Run migrations
- `pnpm db:seed` - Seed database
- `pnpm db:studio` - Open Prisma Studio

## Project Structure

```
indisight-app/
├── docs/                    # Documentation
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (public)/        # Public-facing pages
│   │   ├── admin/           # Admin panel pages
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── admin/          # Admin components
│   │   ├── public/         # Public components
│   │   └── ui/             # shadcn/ui components
│   ├── db/                 # Database schema and migrations
│   ├── trpc/               # tRPC routers and procedures
│   ├── lib/                # Utility functions
│   └── auth/               # Authentication configuration
├── public/                  # Static assets
└── prisma.config.ts        # Prisma configuration
```

## License

Private - IndiSight Platform
