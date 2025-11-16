# PRD - IndiSight Article Management Platform

---

**Company:** [IndiSight](https://indisight.com/)

**Version:** 1.0

**Date:** November 2025

**Timeline:** 2 weeks (Phase 1 & 2)

> Build Philosophy: We're shipping a working MVP in 2 weeks. The architecture needs to be extensible so we can add engagement features, video content, events, and monetization later without rebuilding everything.
> 

---

## 1. Executive Summary

IndiSight needs a CMS for managing their editorial content across different categories - CXO Series, Quiet Architects, Editorial Archive, Events, etc. System should make it easy for editors to create/publish articles and admins to manage everything. Think YourStory.com - featured articles, clean taxonomy, author pages, related content.

**Tech Stack:**

- **Frontend:** React + TypeScript + Next.js (hosting on [Vercel](https://vercel.com/home))
- **API:** [tRPC](https://trpc.io/) for type-safe APIs
- **Database:** PostgreSQL (probably [Neon.tech](https://neon.tech/) or [PlanetScale](https://planetscale.com/))
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **File Storage:** [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)
- **Email Service:** [Resend](https://resend.com/)
- **Payments:** [Stripe](https://stripe.com/in) + [Polar.sh](https://polar.sh/) (for later)
- **Rich Text Editor:** [shadcn-tiptap](https://tiptap.niazmorshed.dev/) (Tiptap + shadcn/ui)
- **Internationalization:** Phase 2+ (i11n then i18n)

---

## 2. User Roles & Permissions

| Role            | Permissions                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Super Admin** | Full system access, user management, category/tag management, system settings                                |
| **Editor**      | Create/edit articles, manage author profiles, publish articles, assign categories/tags, manage media library |
| **Viewer**      | Read-only access to published content, preview unpublished articles                                          |

---

## 3. Core Features

| Feature                 | Capabilities                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User Management**     | Create/manage accounts, assign roles, set credentials, view activity logs, enable/disable users                                                                                                                                                                                                                                                       |
| **Article Management**  | Rich text editor (shadcn-tiptap w/ search/replace, image upload, colors), title/subtitle/excerpt/body, featured image, thumbnail, multiple authors per article, assign to category, add tags, featured flag, trending flag, status workflow (Draft/Review/Published/Archived), SEO metadata, read time calculation, view counter, schedule publishing |
| **Author Management**   | Create profiles, add bio/image/contact, social links, featured author flag, see all articles by author, author stats                                                                                                                                                                                                                                  |
| **Category Management** | Pre-defined: All Articles, CXO Series, Quiet Architects, Editorial Archive, Events. Create custom categories, enable/disable, reorder, category image/icon, descriptions, SEO metadata per category                                                                                                                                                   |
| **Tag Management**      | Create/manage tags, assign to articles for cross-category discovery, trending tags, tag cloud, tag SEO                                                                                                                                                                                                                                                |

---

## 4. Database Schema

### Core Tables

| Table          | Key Fields                                                                                                                                                                                                                                                  | Purpose                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **users**      | id, email, password_hash, name, role, avatar_url, is_active, created_at, updated_at                                                                                                                                                                         | User accounts and auth               |
| **authors**    | id, name, slug, bio, email, profile_image_url, social_links (jsonb), is_featured, article_count, created_at, updated_at                                                                                                                                     | Author profiles & stats              |
| **articles**   | id, title, slug, subtitle, excerpt, content (text/html), featured_image_url, thumbnail_url, is_featured, is_trending, status, view_count, published_at, scheduled_at, seo_meta_title, seo_meta_description, seo_keywords, read_time, created_at, updated_at | Main article content                 |
| **categories** | id, name, slug, description, image_url, icon, is_active, display_order, article_count, parent_id (for nested categories), seo_meta_title, seo_meta_description, created_at, updated_at                                                                      | Content categories with hierarchy    |
| **tags**       | id, name, slug, description, usage_count, is_trending, created_at, updated_at                                                                                                                                                                               | Tags for cross-category organization |

### Junction Tables (Relationships)

| Table                  | Fields                                          | Purpose                                                         |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| **article_authors**    | article_id, author_id, author_order, is_primary | Many-to-many: Articles ↔ Authors (with primary author)          |
| **article_categories** | article_id, category_id, is_primary             | Many-to-many: Articles ↔ Categories (primary for main category) |
| **article_tags**       | article_id, tag_id, created_at                  | Many-to-many: Articles ↔ Tags                                   |
| **article_related**    | article_id, related_article_id, relevance_score | Related articles suggestions                                    |

---

## 5. Key Pages & Screens

### Admin Panel

| Page                | Features                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dashboard**       | Article stats, view counts, trending content, recent activity, quick actions, publish scheduled articles                                                                                                                             |
| **User Management** | User list w/ search/filters, create/edit users, assign roles, activity logs                                                                                                                                                          |
| **Articles**        | Article list with filters (status/category/author/tag), bulk actions, create/edit interface, rich text editor, media upload, select authors/categories/tags, featured toggle, trending toggle, publish controls, schedule publishing |
| **Authors**         | Author list, create/edit profiles, featured toggle, see articles by author, author stats                                                                                                                                             |
| **Categories**      | Category list w/ hierarchy, create/edit, reorder, category image, nested categories support                                                                                                                                          |
| **Tags**            | Tag list, create/edit/merge tags, see usage count, trending tags                                                                                                                                                                     |
| **Settings**        | General settings, SEO defaults, social media integrations, preferences                                                                                                                                                               |

### Public Frontend

| Page               | Features                                                                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Homepage**       | Hero section with featured articles (like YourStory), category navigation, trending articles, latest articles by category, newsletter signup CTA                                  |
| **Category Pages** | Category header w/ description, filtered articles, featured articles in category, pagination/infinite scroll, sidebar with related categories                                     |
| **Article Page**   | Article content (clean reading experience), author card, tags, social share buttons, related articles (by tags/category), "Read More" section, view counter, reading progress bar |
| **Author Page**    | Author bio/image, social links, articles by author grid, author stats (total articles, views)                                                                                     |
| **Tag Page**       | Tag description, articles with this tag, related tags                                                                                                                             |
| **Search**         | Full-text search (articles/authors), autocomplete, filter by category/tag/date/author, search highlights                                                                          |
| **About/Contact**  | Static pages for company info                                                                                                                                                     |

---

## 6. Authentication & Authorization

| Component          | Implementation                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Authentication** | Better Auth - email/password login, sessions, password reset                                    |
| **Authorization**  | Role-based access - Super Admin gets everything, Editors handle content/media, Public read-only |

---

## 7. Success Criteria

| Phase       | Criteria                                                                                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1** | Database and auth working, user management done, all CRUD operations functional, admin panel usable, basic SEO (meta tags, slugs, sitemaps)                                        |
| **Phase 2** | Frontend matches Figma designs, search works, featured articles system working, advanced SEO (structured data, Open Graph), loads under 3s, deployed to production, no major bugs  |
| **Overall** | Editors can publish articles in under 10 min, featured articles display correctly on homepage, all user roles work correctly, related articles showing up, client is happy with it |

---

## 8. Timeline

| Phase                        | Deliverables                                                                                                                                                                                                                                | Duration |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Phase 1: Core Build**      | Database setup, Auth, user management, Article/Author/Category/Tag CRUD, admin panel, basic frontend, **basic SEO** (meta tags, slugs, sitemaps)                                                                                            | 1 week   |
| **Phase 2: Polish & Deploy** | Implement Figma designs, featured articles system, related articles algorithm, polish frontend, add search, **advanced SEO** (structured data, Open Graph, performance), code cleanup, testing, bug fixes, deploy to production, write docs | 1 week   |

**Total: 2 weeks**

### How we're building this

- Build core functionality first, make it work
- Backend and frontend in parallel
- Test as we go
- SEO from day 1
- Featured articles and related content in Phase 2

---

## 9. Open Questions

### Need to decide for Phase 1

- Do we need draft autosave in Phase 1? (can add later if not critical)
- Neon.tech or PlanetScale for database?
- How many featured articles on homepage? (4-6 recommended)

### Can figure out later

- Any content migration needed from existing system?
- [GA4](https://support.google.com/analytics/answer/10089681?hl=en) setup details and what events to track
- Which languages for internationalization
- Related articles algorithm (tags-based vs AI-based)

---

## 10. Future Enhancements (Post Phase 1)

We're building this so we can add these features later without major rewrites:

### Phase 2+ Candidates (Engagement & Content)

- User engagement - likes, comments, shares on articles
- View counts and real-time engagement tracking
- Registration gates for commenting/premium stuff
- Video content ("Leader's Thoughts" series)
- Advanced recommendation engine (ML-based related articles)
- Newsletter integration (email list management)
- Homepage hero with video/animation
- Logo strip showing partners/leaders
- Article series/collections
- Bookmarks/save for later

### Phase 3+ Candidates (Events & Monetization)

- Events system (current/upcoming/past with photos/videos)
- "Apply for Invite" for events
- Event galleries and recaps
- Paywall for case studies (1-2 free samples then pay)
- Payment processing ([Stripe](https://stripe.com/in) + [Polar.sh](https://polar.sh/))
- Both subscription and one-time payments
- Premium content tiers

### Phase 4+ Candidates (Analytics & Advanced)

- GA4 with custom tracking
- Track scroll depth, clicks, drop-offs
- Analyze signup and case study funnels
- Content velocity (how much users consume)
- User behavior insights
- A/B testing for headlines/thumbnails
- Content performance dashboard
- Author analytics

### Technical notes for extensibility

- Database schema has space for future fields (likes, comment_count, bookmark_count)
- Categories support nesting (parent_id) for hierarchies
- Tags system ready for trending/recommendations
- Media library ready for videos and other file types
- User roles extensible for more access levels
- Payment hooks ready for [Stripe](https://stripe.com/in) + [Polar.sh](https://polar.sh/)
- Article relationships table ready for complex recommendations

---

## Notes

- Follow [YourStory](https://yourstory.com/) pattern - clean, featured content driven, good taxonomy
- Focus on performance - image optimization, caching, fast page loads
- Mobile-first approach