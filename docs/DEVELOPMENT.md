# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **pnpm** (package manager)
- **PostgreSQL** database (local or cloud)
- **Cloudflare R2** account (for file storage)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd indisight-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/indisight"
   BETTER_AUTH_SECRET="generate-a-secret-key-min-32-chars"
   CLOUDFLARE_ACCOUNT_ID="your-account-id"
   CLOUDFLARE_R2_BUCKET="your-bucket-name"
   CLOUDFLARE_ACCESS_KEY_ID="your-access-key"
   CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-key"
   NEXT_PUBLIC_CLOUDFLARE_R2_URL="https://your-bucket.r2.cloudflarestorage.com"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   SIGNUP_ENABLED="false"
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Code Style

- **Linting:** `pnpm lint` (uses Biome)
- **Formatting:** `pnpm format` (uses Biome)
- **Type Checking:** `pnpm typecheck` (TypeScript)

### Project Structure

```
src/
├── app/              # Next.js pages (App Router)
├── components/       # React components
├── db/              # Database schema
├── trpc/            # API routes
├── lib/             # Utilities
└── hooks/           # Custom hooks
```

### Adding New Features

1. **Database Changes**
   - Edit Prisma schema files in `src/db/schema/`
   - Run `pnpm db:push` to apply changes
   - Or create migration: `pnpm db:migrate`

2. **API Endpoints**
   - Add procedures to appropriate router in `src/trpc/routers/`
   - Use Zod for input validation
   - Follow existing patterns for error handling

3. **UI Components**
   - Add components to `src/components/`
   - Use shadcn/ui components from `src/components/ui/`
   - Follow component structure: component, subcomponents, helpers, types

4. **Pages**
   - Add pages to `src/app/`
   - Use Server Components by default
   - Add Client Components only when needed

## Database Development

### Prisma Schema

Schema is split into multiple files:
- `base.prisma` - Configuration
- `enums.prisma` - Enums
- `auth.prisma` - Authentication models
- `content.prisma` - CMS models
- `relationships.prisma` - Junction tables

### Common Commands

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema changes (dev)
pnpm db:push

# Create migration (production)
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

### Database Seeding

Edit seed file to add initial data:
- Default admin user
- Sample categories
- Test authors/articles

## API Development

### Adding New tRPC Procedures

1. **Choose the router** (or create new one)
2. **Define input schema** with Zod
3. **Implement procedure** with proper auth
4. **Add to router export**

Example:

```typescript
// src/trpc/routers/cms/article.ts
import { z } from "zod";
import { adminProcedure } from "@/trpc/procedure";

const archiveSchema = z.object({
  id: z.string(),
});

export const articleRouter = router({
  // ... existing procedures
  
  archive: adminProcedure
    .input(archiveSchema)
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

### Testing API Endpoints

Use tRPC client in components or test files:

```typescript
import { trpc } from "@/trpc/client";

const { data } = trpc.cms.article.list.useQuery({});
```

## Component Development

### Component Structure

```typescript
// Component
export const MyComponent = ({ prop1, prop2 }: Props) => {
  // Main component logic
};

// Subcomponents
const SubComponent = () => {};

// Helpers
const helperFunction = () => {};

// Types
type Props = {
  prop1: string;
  prop2: number;
};
```

### Using shadcn/ui Components

Components are in `src/components/ui/`. Import and use:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

### Styling

- Use Tailwind CSS classes
- Follow existing patterns
- Use CSS variables for theming
- Prefer utility classes over custom CSS

## Authentication Development

### Better Auth Setup

Configuration in `src/auth/server.ts` and `src/auth/client.ts`.

### Adding Protected Routes

```typescript
// Server Component
import { auth } from "@/auth/server";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/auth");
  // ...
}
```

### Role-Based Access

```typescript
import { auth } from "@/auth/server";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }
  // ...
}
```

## File Upload Development

### Cloudflare R2 Integration

1. **Get presigned URL**
   ```typescript
   const { url, key } = await trpc.file.getUploadUrl.mutate({
     fileName: "image.jpg",
     fileType: "image/jpeg",
   });
   ```

2. **Upload directly to R2**
   ```typescript
   await fetch(url, {
     method: "PUT",
     body: file,
     headers: { "Content-Type": fileType },
   });
   ```

3. **Store key in database**
   ```typescript
   await trpc.cms.article.update.mutate({
     id: articleId,
     featuredImageUrl: `${R2_URL}/${key}`,
   });
   ```

## Debugging

### Database Queries

Use Prisma Studio:
```bash
pnpm db:studio
```

### API Debugging

- Check browser Network tab
- Use tRPC DevTools (if enabled)
- Check server logs

### Type Errors

Run type checker:
```bash
pnpm typecheck
```

## Common Tasks

### Creating a New Page

1. Create file in `src/app/`
2. Export default component
3. Add metadata for SEO
4. Use Server Components when possible

### Adding a New Admin Section

1. Create page in `src/app/admin/`
2. Add to sidebar navigation
3. Create components in `src/components/admin/`
4. Add tRPC procedures if needed

### Adding a New Public Page

1. Create page in `src/app/(public)/`
2. Add to header navigation if needed
3. Create components in `src/components/public/`
4. Add SEO metadata

## Performance Optimization

### Image Optimization

- Use Next.js `Image` component
- Optimize images before upload
- Use appropriate sizes

### Database Queries

- Use indexes (already defined in schema)
- Avoid N+1 queries (use `include`)
- Use pagination for large datasets

### Code Splitting

- Use dynamic imports for heavy components
- Lazy load non-critical features
- Split large bundles

## Testing

### Manual Testing Checklist

- [ ] Create/edit/delete articles
- [ ] Author management
- [ ] Category hierarchy
- [ ] Tag management
- [ ] File uploads
- [ ] Authentication flows
- [ ] Role-based access
- [ ] SEO metadata
- [ ] Search functionality

### Browser Testing

Test in:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## Troubleshooting

### Database Connection Issues

- Check `DATABASE_URL` in `.env`
- Verify database is running
- Check network/firewall settings

### Authentication Issues

- Verify `BETTER_AUTH_SECRET` is set
- Check session cookies
- Clear browser cookies if needed

### Build Errors

- Run `pnpm clean && pnpm install`
- Check TypeScript errors: `pnpm typecheck`
- Verify all environment variables

### File Upload Issues

- Check Cloudflare R2 credentials
- Verify bucket permissions
- Check CORS settings

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation

### Commit Messages

Use clear, descriptive commit messages:
```
feat: add article search functionality
fix: resolve category hierarchy validation
docs: update API documentation
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

