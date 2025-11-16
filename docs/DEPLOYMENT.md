# Deployment Guide

## Overview

This guide covers deploying the IndiSight platform to production. The recommended setup uses Vercel for hosting, Neon or PlanetScale for the database, and Cloudflare R2 for file storage.

## Prerequisites

- Vercel account
- PostgreSQL database (Neon.tech or PlanetScale)
- Cloudflare R2 account
- Domain name (optional but recommended)

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Database seeded (if needed)
- [ ] Cloudflare R2 bucket created and configured
- [ ] Build passes locally (`pnpm build`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)

## Environment Variables

### Required Variables

Set these in your deployment platform:

#### Database
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

#### Authentication
```env
BETTER_AUTH_SECRET="generate-strong-secret-min-32-chars"
```

#### Cloudflare R2
```env
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_BUCKET="your-bucket-name"
CLOUDFLARE_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-key"
NEXT_PUBLIC_CLOUDFLARE_R2_URL="https://your-bucket.r2.cloudflarestorage.com"
```

#### Application
```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
SIGNUP_ENABLED="false"
```

#### Optional
```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # Google Analytics
```

## Database Setup

### Option 1: Neon.tech

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Set as `DATABASE_URL` in environment variables

### Option 2: PlanetScale

1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Copy connection string
4. Set as `DATABASE_URL` in environment variables

### Apply Migrations

After setting up database:

```bash
# Run migrations
pnpm db:migrate

# Or push schema (dev only)
pnpm db:push
```

## Cloudflare R2 Setup

1. **Create R2 Bucket**
   - Go to Cloudflare Dashboard → R2
   - Create new bucket
   - Note bucket name

2. **Create API Token**
   - Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
   - Create token with read/write permissions
   - Save Access Key ID and Secret Access Key

3. **Configure CORS** (if needed)
   - Set CORS policy for your domain
   - Allow PUT, GET, DELETE methods

4. **Set Public URL**
   - Use R2 public URL or custom domain
   - Set as `NEXT_PUBLIC_CLOUDFLARE_R2_URL`

## Vercel Deployment

### Initial Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect Next.js

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `.` (or leave default)
   - Build Command: `pnpm build`
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables (see above)
   - Set for Production, Preview, and Development

4. **Deploy**
   - Click Deploy
   - Wait for build to complete
   - Check deployment logs for errors

### Post-Deployment

1. **Run Database Migrations**
   ```bash
   # Connect to production database
   DATABASE_URL="production-url" pnpm db:migrate
   ```

2. **Seed Database** (if needed)
   ```bash
   DATABASE_URL="production-url" pnpm db:seed
   ```

3. **Verify Deployment**
   - Visit deployed URL
   - Test authentication
   - Test file uploads
   - Check admin panel

## Custom Domain

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your domain
   - Redeploy if needed

3. **Configure DNS**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation

## Database Migrations in Production

### Safe Migration Process

1. **Test Locally**
   ```bash
   pnpm db:migrate
   ```

2. **Create Migration**
   ```bash
   pnpm db:migrate --name migration-name
   ```

3. **Review Migration**
   - Check generated SQL
   - Test on staging if available

4. **Apply to Production**
   ```bash
   DATABASE_URL="production-url" pnpm db:migrate deploy
   ```

### Rollback Strategy

- Keep migration history
- Test rollback migrations locally
- Have database backups before migrations

## Monitoring

### Vercel Analytics

- Enable in Project Settings
- Monitor performance metrics
- Track errors

### Database Monitoring

- Use database provider's monitoring
- Set up alerts for connection issues
- Monitor query performance

### Application Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor API response times
- Track user activity

## Performance Optimization

### Build Optimization

- Enable Vercel's automatic optimizations
- Use Next.js Image component
- Optimize bundle size

### Database Optimization

- Use connection pooling
- Monitor slow queries
- Add indexes as needed

### CDN & Caching

- Vercel Edge Network (automatic)
- Static asset caching
- API route caching where appropriate

## Security Checklist

- [ ] Strong `BETTER_AUTH_SECRET` (32+ chars, random)
- [ ] Database credentials secure
- [ ] R2 credentials secure
- [ ] `SIGNUP_ENABLED="false"` in production
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not exposed
- [ ] CORS configured correctly
- [ ] Rate limiting (consider Vercel Pro)

## Backup Strategy

### Database Backups

- Use database provider's automatic backups
- Set up regular manual backups
- Test restore process

### File Backups

- R2 versioning (if enabled)
- Regular exports of critical files
- Document backup procedures

## Troubleshooting

### Build Failures

1. Check build logs in Vercel
2. Verify all environment variables set
3. Test build locally: `pnpm build`
4. Check for TypeScript errors: `pnpm typecheck`

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check database is accessible
3. Verify firewall/network settings
4. Test connection locally with production URL

### File Upload Issues

1. Verify R2 credentials
2. Check bucket permissions
3. Verify CORS configuration
4. Check `NEXT_PUBLIC_CLOUDFLARE_R2_URL`

### Authentication Issues

1. Verify `BETTER_AUTH_SECRET` is set
2. Check `NEXT_PUBLIC_APP_URL` matches domain
3. Clear cookies and retry
4. Check session configuration

## Rollback Procedure

### Vercel Rollback

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

### Database Rollback

1. Restore from backup
2. Or run rollback migration:
   ```bash
   DATABASE_URL="production-url" pnpm db:migrate rollback
   ```

## Maintenance

### Regular Tasks

- Monitor error logs
- Review performance metrics
- Update dependencies (test first)
- Review security updates
- Backup database regularly

### Updates

1. Test updates locally
2. Deploy to preview environment
3. Test thoroughly
4. Deploy to production
5. Monitor for issues

## Scaling Considerations

### Database Scaling

- Use connection pooling
- Monitor query performance
- Consider read replicas for heavy read loads

### Application Scaling

- Vercel handles horizontal scaling automatically
- Monitor function execution times
- Optimize slow API routes

### File Storage Scaling

- R2 scales automatically
- Monitor storage usage
- Set up lifecycle policies if needed

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review error messages
3. Check environment variables
4. Verify database connectivity
5. Review application logs

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

