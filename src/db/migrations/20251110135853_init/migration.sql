-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE
    "user" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "email_verified" BOOLEAN NOT NULL DEFAULT false,
        "image" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "user_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "session" (
        "id" TEXT NOT NULL,
        "expires_at" TIMESTAMP(3) NOT NULL,
        "token" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        "ip_address" TEXT,
        "user_agent" TEXT,
        "user_id" TEXT NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "account" (
        "id" TEXT NOT NULL,
        "account_id" TEXT NOT NULL,
        "provider_id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "access_token" TEXT,
        "refresh_token" TEXT,
        "id_token" TEXT,
        "access_token_expires_at" TIMESTAMP(3),
        "refresh_token_expires_at" TIMESTAMP(3),
        "scope" TEXT,
        "password" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "account_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "verification" (
        "id" TEXT NOT NULL,
        "identifier" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "expires_at" TIMESTAMP(3) NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "author" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "bio" TEXT,
        "email" TEXT,
        "profile_image_url" TEXT,
        "profile_image_alt" TEXT,
        "social_links" JSONB,
        "is_featured" BOOLEAN NOT NULL DEFAULT false,
        "article_count" INTEGER NOT NULL DEFAULT 0,
        "user_id" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "author_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "article" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "subtitle" TEXT,
        "excerpt" TEXT,
        "content" JSONB NOT NULL,
        "featured_image_url" TEXT,
        "featured_image_alt" TEXT,
        "thumbnail_url" TEXT,
        "thumbnail_alt" TEXT,
        "is_featured" BOOLEAN NOT NULL DEFAULT false,
        "is_trending" BOOLEAN NOT NULL DEFAULT false,
        "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
        "view_count" INTEGER NOT NULL DEFAULT 0,
        "read_time" INTEGER,
        "published_at" TIMESTAMP(3),
        "scheduled_at" TIMESTAMP(3),
        "seo_meta_title" TEXT,
        "seo_meta_description" TEXT,
        "seo_keywords" TEXT,
        "like_count" INTEGER DEFAULT 0,
        "comment_count" INTEGER DEFAULT 0,
        "bookmark_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "article_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "image_url" TEXT,
        "image_alt" TEXT,
        "icon" TEXT,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "display_order" INTEGER NOT NULL DEFAULT 0,
        "article_count" INTEGER NOT NULL DEFAULT 0,
        "parent_id" TEXT,
        "seo_meta_title" TEXT,
        "seo_meta_description" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "category_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "tag" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "usage_count" INTEGER NOT NULL DEFAULT 0,
        "is_trending" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "article_author" (
        "article_id" TEXT NOT NULL,
        "author_id" TEXT NOT NULL,
        "author_order" INTEGER NOT NULL DEFAULT 0,
        "is_primary" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "article_author_pkey" PRIMARY KEY ("article_id", "author_id")
    );

-- CreateTable
CREATE TABLE
    "article_category" (
        "article_id" TEXT NOT NULL,
        "category_id" TEXT NOT NULL,
        "is_primary" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "article_category_pkey" PRIMARY KEY ("article_id", "category_id")
    );

-- CreateTable
CREATE TABLE
    "article_tag" (
        "article_id" TEXT NOT NULL,
        "tag_id" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "article_tag_pkey" PRIMARY KEY ("article_id", "tag_id")
    );

-- CreateTable
CREATE TABLE
    "article_related" (
        "article_id" TEXT NOT NULL,
        "related_article_id" TEXT NOT NULL,
        "relevance_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
        CONSTRAINT "article_related_pkey" PRIMARY KEY ("article_id", "related_article_id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session" ("token");

-- CreateIndex
CREATE UNIQUE INDEX "author_slug_key" ON "author" ("slug");

-- CreateIndex
CREATE INDEX "author_slug_idx" ON "author" ("slug");

-- CreateIndex
CREATE INDEX "author_user_id_idx" ON "author" ("user_id");

-- CreateIndex
CREATE INDEX "author_is_featured_idx" ON "author" ("is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "article_slug_key" ON "article" ("slug");

-- CreateIndex
CREATE INDEX "article_slug_idx" ON "article" ("slug");

-- CreateIndex
CREATE INDEX "article_status_published_at_idx" ON "article" ("status", "published_at");

-- CreateIndex
CREATE INDEX "article_is_featured_idx" ON "article" ("is_featured");

-- CreateIndex
CREATE INDEX "article_is_trending_idx" ON "article" ("is_trending");

-- CreateIndex
CREATE INDEX "article_published_at_idx" ON "article" ("published_at");

-- CreateIndex
CREATE INDEX "article_scheduled_at_idx" ON "article" ("scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category" ("slug");

-- CreateIndex
CREATE INDEX "category_slug_idx" ON "category" ("slug");

-- CreateIndex
CREATE INDEX "category_parent_id_idx" ON "category" ("parent_id");

-- CreateIndex
CREATE INDEX "category_is_active_display_order_idx" ON "category" ("is_active", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "tag_slug_key" ON "tag" ("slug");

-- CreateIndex
CREATE INDEX "tag_slug_idx" ON "tag" ("slug");

-- CreateIndex
CREATE INDEX "tag_is_trending_idx" ON "tag" ("is_trending");

-- CreateIndex
CREATE INDEX "tag_usage_count_idx" ON "tag" ("usage_count");

-- CreateIndex
CREATE INDEX "article_author_author_id_idx" ON "article_author" ("author_id");

-- CreateIndex
CREATE INDEX "article_author_article_id_is_primary_idx" ON "article_author" ("article_id", "is_primary");

-- CreateIndex
CREATE INDEX "article_category_category_id_idx" ON "article_category" ("category_id");

-- CreateIndex
CREATE INDEX "article_category_article_id_is_primary_idx" ON "article_category" ("article_id", "is_primary");

-- CreateIndex
CREATE INDEX "article_tag_tag_id_idx" ON "article_tag" ("tag_id");

-- CreateIndex
CREATE INDEX "article_related_related_article_id_idx" ON "article_related" ("related_article_id");

-- CreateIndex
CREATE INDEX "article_related_article_id_relevance_score_idx" ON "article_related" ("article_id", "relevance_score");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "category" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_author" ADD CONSTRAINT "article_author_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_author" ADD CONSTRAINT "article_author_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "author" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_category" ADD CONSTRAINT "article_category_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_category" ADD CONSTRAINT "article_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tag" ADD CONSTRAINT "article_tag_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tag" ADD CONSTRAINT "article_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_related" ADD CONSTRAINT "article_related_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_related" ADD CONSTRAINT "article_related_related_article_id_fkey" FOREIGN KEY ("related_article_id") REFERENCES "article" ("id") ON DELETE CASCADE ON UPDATE CASCADE;