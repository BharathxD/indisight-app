# API Documentation

Complete API reference for IndiSight Platform using tRPC.

## Overview

All APIs are type-safe and accessible via tRPC. The API is organized into logical routers:

- `health` - Health checks
- `cms` - Content management operations
- `file` - File upload/download
- `analytics` - Analytics and statistics
- `user` - User management

## Base URL

- **Development:** `http://localhost:3000/api/trpc`
- **Production:** `https://your-domain.com/api/trpc`

## Authentication

Most endpoints require authentication. Include session cookies in requests or use the tRPC client with authentication context.

### User Roles

- `SUPER_ADMIN` - Full access
- `EDITOR` - Content management
- `VIEWER` - Read-only

## Routers

### Health Router

#### `health.check`

Health check endpoint.

**Type:** Query  
**Auth:** Public

```typescript
const result = await trpc.health.check.query();
// Returns: { status: "ok", timestamp: Date }
```

---

### CMS Router

See [CMS Router Documentation](./ARCHITECTURE.md#cms-router) for detailed examples.

#### Author Operations

- `cms.author.list` - List authors with pagination
- `cms.author.getBySlug` - Get author by slug
- `cms.author.create` - Create new author
- `cms.author.update` - Update author
- `cms.author.delete` - Delete author

#### Article Operations

- `cms.article.list` - List articles with filters
- `cms.article.getBySlug` - Get article by slug
- `cms.article.create` - Create new article
- `cms.article.update` - Update article
- `cms.article.publish` - Publish article
- `cms.article.unpublish` - Unpublish article
- `cms.article.incrementViewCount` - Increment view counter
- `cms.article.delete` - Delete article

#### Category Operations

- `cms.category.list` - List categories
- `cms.category.getTree` - Get hierarchical category tree
- `cms.category.getBySlug` - Get category by slug
- `cms.category.create` - Create category
- `cms.category.update` - Update category
- `cms.category.reorder` - Reorder category
- `cms.category.delete` - Delete category

#### Tag Operations

- `cms.tag.list` - List tags
- `cms.tag.getBySlug` - Get tag by slug
- `cms.tag.create` - Create tag
- `cms.tag.update` - Update tag
- `cms.tag.delete` - Delete tag
- `cms.tag.mergeTags` - Merge multiple tags

#### Person Operations

- `cms.person.list` - List people
- `cms.person.getBySlug` - Get person by slug
- `cms.person.create` - Create person profile
- `cms.person.update` - Update person
- `cms.person.delete` - Delete person

#### User Operations

- `cms.user.list` - List users
- `cms.user.getById` - Get user by ID
- `cms.user.create` - Create user
- `cms.user.update` - Update user
- `cms.user.delete` - Delete user

---

### File Router

#### `file.getUploadUrl`

Get presigned URL for direct upload to Cloudflare R2.

**Type:** Mutation  
**Auth:** Required (EDITOR or SUPER_ADMIN)

```typescript
const { url, key } = await trpc.file.getUploadUrl.mutate({
  fileName: "image.jpg",
  fileType: "image/jpeg",
  folder: "articles", // Optional folder prefix
});
```

**Response:**
```typescript
{
  url: string; // Presigned upload URL
  key: string; // File key for storage
}
```

#### `file.delete`

Delete file from Cloudflare R2.

**Type:** Mutation  
**Auth:** Required (EDITOR or SUPER_ADMIN)

```typescript
await trpc.file.delete.mutate({
  key: "articles/image.jpg",
});
```

---

### Analytics Router

#### `analytics.getDashboardStats`

Get dashboard statistics.

**Type:** Query  
**Auth:** Required (VIEWER or higher)

```typescript
const stats = await trpc.analytics.getDashboardStats.query();
```

**Response:**
```typescript
{
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalAuthors: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
  recentArticles: Article[];
}
```

---

### User Router

#### `user.getProfile`

Get current user profile.

**Type:** Query  
**Auth:** Required

```typescript
const profile = await trpc.user.getProfile.query();
```

#### `user.updateProfile`

Update current user profile.

**Type:** Mutation  
**Auth:** Required

```typescript
await trpc.user.updateProfile.mutate({
  name: "New Name",
  avatarUrl: "https://...",
});
```

#### `user.changePassword`

Change user password.

**Type:** Mutation  
**Auth:** Required

```typescript
await trpc.user.changePassword.mutate({
  currentPassword: "old-password",
  newPassword: "new-password",
});
```

## Error Handling

All procedures use tRPC error handling:

```typescript
import { TRPCError } from "@trpc/server";

// Common error codes:
// - UNAUTHORIZED (401)
// - FORBIDDEN (403)
// - NOT_FOUND (404)
// - CONFLICT (409)
// - BAD_REQUEST (400)
// - PRECONDITION_FAILED (412)
// - INTERNAL_SERVER_ERROR (500)
```

## Type Safety

All procedures are fully typed. Use TypeScript inference:

```typescript
import type { AppRouter } from "@/trpc/routers";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ArticleListOutput = RouterOutput["cms"]["article"]["list"];
```

## Usage Examples

### Client-Side (React)

```typescript
import { trpc } from "@/trpc/client";

function ArticleList() {
  const { data, isLoading } = trpc.cms.article.list.useQuery({
    status: "PUBLISHED",
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

### Server-Side (Server Components)

```typescript
import { getServerClient } from "@/trpc/server-client";

export default async function ArticlePage() {
  const trpc = getServerClient();
  const article = await trpc.cms.article.getBySlug.query({
    slug: "article-slug",
  });

  return <div>{article.title}</div>;
}
```

### Mutations

```typescript
import { trpc } from "@/trpc/client";

function CreateArticle() {
  const utils = trpc.useUtils();
  const createArticle = trpc.cms.article.create.useMutation({
    onSuccess: () => {
      utils.cms.article.list.invalidate();
    },
  });

  const handleSubmit = async (data: ArticleInput) => {
    await createArticle.mutateAsync(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Pagination

Most list endpoints support cursor-based pagination:

```typescript
const { articles, nextCursor } = await trpc.cms.article.list.query({
  limit: 20,
  cursor: undefined, // First page
});

// Next page
const { articles: nextPage, nextCursor: next } = await trpc.cms.article.list.query({
  limit: 20,
  cursor: nextCursor,
});
```

## Filtering & Search

Many endpoints support filtering:

```typescript
// Articles by category
const articles = await trpc.cms.article.list.query({
  categoryId: "cat123",
});

// Articles by author
const articles = await trpc.cms.article.list.query({
  authorId: "author123",
});

// Search articles
const articles = await trpc.cms.article.list.query({
  search: "technology",
});

// Multiple filters
const articles = await trpc.cms.article.list.query({
  status: "PUBLISHED",
  isFeatured: true,
  categoryId: "cat123",
  search: "leadership",
  limit: 20,
});
```

## Best Practices

1. **Use TypeScript** - Leverage full type inference
2. **Handle Errors** - Wrap calls in try/catch or use error boundaries
3. **Invalidate Queries** - After mutations, invalidate related queries
4. **Use Pagination** - For large datasets, use cursor pagination
5. **Optimistic Updates** - Use optimistic updates for better UX
6. **Cache Strategically** - React Query handles caching automatically

