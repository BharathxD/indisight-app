# IndiSight CMS Database Schema

## Quick Start

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

## Schema Overview

A normalized, production-ready PostgreSQL schema for the IndiSight article management platform.

**Total Models**: 11
- **Core Content**: Author, Article, Category, Tag
- **Relationships**: ArticleAuthor, ArticleCategory, ArticleTag, ArticleRelated
- **Authentication**: User, Session, Account, Verification

## Key Design Decisions

### 1. Authors Separate from Users
Authors can exist without system accounts (guest contributors), with optional `userId` link for authenticated authors.

### 2. Tiptap JSON Content Storage
Articles store content as JSON only. Render HTML on-demand for flexibility and reduced storage.

### 3. Direct Image URLs
No File model - images stored on Cloudflare R2 with direct URLs and alt text fields on models.

### 4. Denormalized Counters
`articleCount`, `usageCount`, `viewCount` stored for fast reads. Updated via application logic.

### 5. Hierarchical Categories
Self-referential `parentId` supports unlimited nesting (e.g., "CXO Series" → "CEO Interviews").

## Schema Files

- `base.prisma` - Configuration (generators, datasource)
- `enums.prisma` - UserRole, ArticleStatus
- `auth.prisma` - User authentication (Better Auth)
- `content.prisma` - Core CMS models
- `relationships.prisma` - Junction tables

## Documentation

- **SCHEMA_SUMMARY.md** - Complete model reference with fields, indexes, relationships
- **SCHEMA_DESIGN.md** - Detailed rationale for all design decisions

## Common Queries

### Get Published Articles with Authors
```typescript
const articles = await db.article.findMany({
  where: { status: ArticleStatus.PUBLISHED },
  include: {
    articleAuthors: {
      include: { author: true },
      orderBy: { authorOrder: 'asc' }
    }
  },
  orderBy: { publishedAt: 'desc' }
})
```

### Get Category with Articles
```typescript
const category = await db.category.findUnique({
  where: { slug: 'cxo-series' },
  include: {
    articleCategories: {
      where: { article: { status: ArticleStatus.PUBLISHED } },
      include: { article: true }
    }
  }
})
```

### Get Article with All Relations
```typescript
const article = await db.article.findUnique({
  where: { slug: 'article-slug' },
  include: {
    articleAuthors: { include: { author: true } },
    articleCategories: { include: { category: true } },
    articleTags: { include: { tag: true } },
    relatedArticles: { include: { relatedArticle: true } }
  }
})
```

## Indexes

All models have strategic indexes for common queries:
- Slug fields (unique lookups)
- Status + publishedAt (filtered lists)
- isFeatured, isTrending (homepage)
- Foreign keys (join performance)
- Compound indexes for common WHERE clauses

## Extensibility

Schema ready for Phase 2+ features:
- Engagement metrics (likeCount, commentCount, bookmarkCount)
- Scheduled publishing (scheduledAt)
- Related articles (ArticleRelated table)
- Hierarchical categories (parentId)

Not implemented (add later if needed):
- File/MediaFolder models
- SearchKeyword tracking
- ViewLog detailed analytics
- ArticleSeries/Collections

