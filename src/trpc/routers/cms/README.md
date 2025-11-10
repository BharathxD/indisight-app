# CMS tRPC Routers

Complete type-safe API for managing IndiSight CMS content.

## Structure

```
cms/
  author.ts      - Author CRUD operations
  article.ts     - Article management with relationships
  category.ts    - Hierarchical category management
  tag.ts         - Tag management with merge capability
  utils.ts       - Shared helper functions
  index.ts       - Combined CMS router export
```

## Usage

All routers require `adminProcedure` (SUPER_ADMIN role).

### Author Router

```typescript
// List authors with pagination
const { authors, nextCursor } = await trpc.cms.author.list.query({
  isFeatured: true,
  search: "john",
  limit: 20,
  cursor: "cuid123",
});

// Get author by slug
const author = await trpc.cms.author.getBySlug.query({ slug: "john-doe" });

// Create author
const newAuthor = await trpc.cms.author.create.mutate({
  name: "John Doe",
  slug: "john-doe",
  bio: "Tech writer",
  email: "john@example.com",
  profileImageUrl: "https://...",
  profileImageAlt: "John Doe headshot",
  socialLinks: {
    twitter: "https://twitter.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
  },
  isFeatured: true,
  userId: "user123", // Optional link to User account
});

// Update author
await trpc.cms.author.update.mutate({
  id: "author123",
  bio: "Updated bio",
});

// Delete author (fails if articleCount > 0)
await trpc.cms.author.delete.mutate({ id: "author123" });
```

### Article Router

```typescript
// List articles with filters
const { articles, nextCursor } = await trpc.cms.article.list.query({
  status: ArticleStatus.PUBLISHED,
  categoryId: "cat123",
  authorId: "author123",
  tagId: "tag123",
  isFeatured: true,
  search: "technology",
  limit: 20,
});

// Get article with all relations
const article = await trpc.cms.article.getBySlug.query({ slug: "article-slug" });

// Create article
const newArticle = await trpc.cms.article.create.mutate({
  title: "Article Title",
  slug: "article-title",
  subtitle: "Subtitle",
  excerpt: "Brief summary",
  content: { type: "doc", content: [...] }, // Tiptap JSON
  featuredImageUrl: "https://...",
  featuredImageAlt: "Image description",
  status: ArticleStatus.DRAFT,
  authorIds: ["author1", "author2"],
  primaryAuthorId: "author1", // Must be in authorIds
  categoryIds: ["cat1", "cat2"],
  primaryCategoryId: "cat1", // Must be in categoryIds
  tagIds: ["tag1", "tag2"],
  readTime: 5,
  scheduledAt: new Date("2025-12-01"),
  seoMetaTitle: "SEO Title",
  seoMetaDescription: "SEO Description",
});

// Update article (relationships optional)
await trpc.cms.article.update.mutate({
  id: "article123",
  title: "Updated Title",
  authorIds: ["author1", "author3"], // Recalculates counts
  primaryAuthorId: "author1",
});

// Publish article (validates requirements)
await trpc.cms.article.publish.mutate({ id: "article123" });

// Unpublish article
await trpc.cms.article.unpublish.mutate({ id: "article123" });

// Increment view count
await trpc.cms.article.incrementViewCount.mutate({ id: "article123" });

// Delete article (cleans up relationships and counters)
await trpc.cms.article.delete.mutate({ id: "article123" });
```

### Category Router

```typescript
// List categories
const categories = await trpc.cms.category.list.query({
  isActive: true,
  parentId: null, // Root categories only
  search: "tech",
});

// Get category tree (hierarchical)
const tree = await trpc.cms.category.getTree.query();

// Get category by slug
const category = await trpc.cms.category.getBySlug.query({ slug: "cxo-series" });

// Create category
const newCategory = await trpc.cms.category.create.mutate({
  name: "CXO Series",
  slug: "cxo-series",
  description: "Leadership insights",
  imageUrl: "https://...",
  imageAlt: "CXO Series banner",
  icon: "👔",
  isActive: true,
  displayOrder: 1,
  parentId: null, // Root category
  seoMetaTitle: "CXO Series",
  seoMetaDescription: "Leadership insights from top executives",
});

// Update category (validates circular hierarchy)
await trpc.cms.category.update.mutate({
  id: "cat123",
  parentId: "parentCat123", // Validates no circular refs
});

// Reorder category
await trpc.cms.category.reorder.mutate({
  id: "cat123",
  newDisplayOrder: 5,
});

// Delete category (fails if has articles or children)
await trpc.cms.category.delete.mutate({ id: "cat123" });
```

### Tag Router

```typescript
// List tags
const { tags, nextCursor } = await trpc.cms.tag.list.query({
  isTrending: true,
  search: "javascript",
  limit: 50,
});

// Get tag by slug
const tag = await trpc.cms.tag.getBySlug.query({ slug: "javascript" });

// Create tag
const newTag = await trpc.cms.tag.create.mutate({
  name: "JavaScript",
  slug: "javascript",
  description: "JavaScript programming language",
  isTrending: false,
});

// Update tag
await trpc.cms.tag.update.mutate({
  id: "tag123",
  isTrending: true,
});

// Delete tag (fails if usageCount > 0)
await trpc.cms.tag.delete.mutate({ id: "tag123" });

// Merge tags (combines multiple tags into one)
await trpc.cms.tag.mergeTags.mutate({
  sourceTagIds: ["tag1", "tag2", "tag3"],
  targetTagId: "tag4", // All articles reassigned to this tag
});
```

## Validation & Data Consistency

### Author Router
- ✅ Slug uniqueness enforced
- ✅ Email format validation
- ✅ Optional userId link validated
- ✅ Prevents deletion if articleCount > 0
- ✅ articleCount auto-managed

### Article Router
- ✅ Slug uniqueness enforced
- ✅ Publish requirements validated (title, excerpt, content, authors, categories)
- ✅ Exactly one primary author required
- ✅ Exactly one primary category required
- ✅ scheduledAt must be future date
- ✅ Author/category/tag counts auto-updated on create/update/delete
- ✅ Relationship cleanup on delete

### Category Router
- ✅ Slug uniqueness enforced
- ✅ Circular hierarchy prevention
- ✅ Max depth validation (3 levels)
- ✅ Active parent required for active children
- ✅ Prevents deletion if has articles or children
- ✅ articleCount auto-managed

### Tag Router
- ✅ Slug uniqueness enforced
- ✅ Prevents deletion if usageCount > 0
- ✅ usageCount auto-managed
- ✅ Merge operation handles duplicates

## Error Codes

- `UNAUTHORIZED` - Not authenticated or not SUPER_ADMIN
- `NOT_FOUND` - Entity doesn't exist
- `CONFLICT` - Slug already exists, circular hierarchy
- `BAD_REQUEST` - Invalid data, missing required fields
- `PRECONDITION_FAILED` - Has relationships preventing delete

## Helper Functions

### `generateSlug(text: string): string`
Converts text to URL-safe slug (lowercase, hyphens, no special chars).

### `validateSlugUnique(db, model, slug, excludeId?): Promise<void>`
Checks slug uniqueness across model, optionally excluding an ID.

### `updateAuthorArticleCount(db, authorId): Promise<void>`
Recalculates and updates author's article count.

### `updateCategoryArticleCount(db, categoryId): Promise<void>`
Recalculates and updates category's article count.

### `updateTagUsageCount(db, tagId): Promise<void>`
Recalculates and updates tag's usage count.

### `validateCircularHierarchy(db, categoryId, parentId): Promise<void>`
Prevents circular references in category hierarchy, enforces max depth.

## Design Patterns

1. **Co-located Schemas** - Zod schemas defined at top of each router file
2. **Early Returns** - Validation fails fast with descriptive errors
3. **Database Transactions** - Multi-step operations use `$transaction`
4. **Type Safety** - Full TypeScript inference from input to output
5. **Cursor Pagination** - Efficient pagination for large datasets
6. **Relationship Management** - Automatic counter updates and cleanup

