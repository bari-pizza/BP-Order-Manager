# Deployment Guide - Bari Pizza Order Manager

## Overview

This guide covers deploying the Bari Pizza Order Manager to production. The app is configured to work with Railway (based on `railway.toml`), but can be deployed to any static hosting service.

## Prerequisites

- Completed [SETUP.md](./SETUP.md) steps
- Production Supabase project (can use same as development)
- Domain name (optional but recommended)
- SSL certificate (usually provided by hosting platform)

## Deployment Platforms

### Option 1: Railway (Recommended - Already Configured)

Railway is preconfigured in `railway.toml`.

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up/sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables**
   - Go to your project settings
   - Add environment variables:
     ```
     VITE_SUPABASE_URL=your-production-supabase-url
     VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
     ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Wait for deployment to complete (5-10 minutes)
   - Your app will be available at `https://your-project.railway.app`

5. **Custom Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

#### Railway Configuration

The app uses the following Railway configuration (`railway.toml`):

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run serve"
restartPolicyType = "NEVER"
```

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Environment Variables**
   - Go to Vercel dashboard
   - Project Settings > Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 3: Netlify

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login and Deploy**
   ```bash
   netlify login
   netlify deploy --prod --dir=dist
   ```

4. **Environment Variables**
   - Go to Netlify dashboard
   - Site settings > Build & deploy > Environment
   - Add your variables

### Option 4: Static Hosting (AWS S3, Digital Ocean Spaces, etc.)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder contents to your hosting**
   - Configure as static website
   - Set index document to `index.html`
   - Configure error document to `index.html` (for client-side routing)

3. **Environment Variables**
   - Create `.env.production` file before building
   - Or inject variables during build:
     ```bash
     VITE_SUPABASE_URL=xxx VITE_SUPABASE_ANON_KEY=yyy npm run build
     ```

## Post-Deployment Checklist

### 1. Verify Environment Variables
```bash
# Open browser console on your deployed site
console.log(import.meta.env.VITE_SUPABASE_URL)
```
Should show your Supabase URL (not undefined)

### 2. Test Authentication
- [ ] Can you sign up?
- [ ] Can you log in?
- [ ] Does logout work?
- [ ] Can you reset password?

### 3. Test Core Functionality
- [ ] Can you create an order?
- [ ] Can you edit an order?
- [ ] Can orders be assigned to drivers?
- [ ] Can drawers be opened/closed?
- [ ] Does the manager dashboard load?
- [ ] Does the admin dashboard work?

### 4. Test Mobile Experience
- [ ] Open on mobile device
- [ ] Install as PWA (if supported)
- [ ] Test offline capabilities
- [ ] Test responsive design

### 5. Verify Supabase Configuration
- [ ] RLS policies are enabled
- [ ] Storage buckets are accessible
- [ ] Database functions work
- [ ] Realtime subscriptions work

### 6. Performance Check
- [ ] Run Lighthouse audit (aim for 90+ on performance)
- [ ] Check bundle size (should be < 5MB with workbox cache)
- [ ] Test loading speed on 3G network

### 7. Security Check
- [ ] No console.logs exposing sensitive data
- [ ] No exposed API keys in client code
- [ ] HTTPS is enforced
- [ ] CSP headers configured (if applicable)

## Supabase Production Setup

### 1. Database Backups

Supabase automatically backs up your database. Verify:
- Go to Supabase Dashboard > Settings > Backups
- Ensure daily backups are enabled

### 2. Row Level Security

Verify all tables have RLS enabled:

```sql
-- Check RLS status for all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All should show `rowsecurity = true`.

### 3. Monitoring

Set up Supabase monitoring:
- Go to Supabase Dashboard > Reports
- Monitor API usage
- Set up alerts for high error rates

## Monitoring & Error Tracking

### Recommended: Sentry Integration

1. **Create Sentry Account**
   - Go to [sentry.io](https://sentry.io)
   - Create new project (React)

2. **Install Sentry**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

3. **Configure Sentry**
   ```typescript
   // src/main.tsx
   import * as Sentry from "@sentry/react";
   
   if (import.meta.env.PROD) {
     Sentry.init({
       dsn: "your-sentry-dsn",
       integrations: [new Sentry.BrowserTracing()],
       tracesSampleRate: 0.1,
     });
   }
   ```

4. **Add to Environment Variables**
   ```
   VITE_SENTRY_DSN=your-sentry-dsn
   ```

## Rollback Strategy

### If Deployment Fails

#### Railway:
- Go to Deployments
- Click on previous successful deployment
- Click "Redeploy"

#### Vercel:
```bash
vercel rollback
```

#### Manual (Static Hosting):
- Keep previous `dist/` folder backup
- Re-upload previous version

## Updating the Application

### Regular Updates

1. **Make changes in development**
2. **Test locally**
   ```bash
   npm run build
   npm run preview
   ```
3. **Commit and push to GitHub**
4. **Automatic deployment** (if configured)
   - Railway/Vercel will auto-deploy on push to main

### Manual Updates

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Build
npm run build

# Deploy (platform-specific)
```

## Performance Optimization

### Enable Compression

Most hosting platforms enable this by default. Verify:
- Gzip/Brotli compression is enabled
- Check response headers for `content-encoding: gzip`

### CDN Configuration

If using a CDN:
- Cache static assets for 1 year
- Cache HTML for 1 hour
- Enable cache invalidation on deployment

### Bundle Size Optimization

Current bundle size should be reasonable. To optimize further:

```bash
# Analyze bundle
npm run build -- --mode=analyze

# Look for large dependencies
# Consider lazy loading or alternatives
```

## SSL/HTTPS

Most platforms (Railway, Vercel, Netlify) provide automatic HTTPS.

### Custom Domain SSL

1. **Railway:**
   - Add custom domain
   - SSL is automatic via Let's Encrypt

2. **Cloudflare (Recommended for additional features):**
   - Add your domain to Cloudflare
   - Configure DNS to point to your host
   - Enable "Full (Strict)" SSL mode
   - Benefits: DDoS protection, WAF, better caching

## Domain Configuration

### DNS Records

For custom domain `app.yourdomain.com`:

```
Type: CNAME
Name: app
Value: your-app.railway.app (or your platform's URL)
TTL: Auto
```

### Redirect www to non-www (or vice versa)

Configure in your hosting platform or use DNS:

```
Type: CNAME
Name: www
Value: your-app.railway.app

# Then configure redirect in Railway/Vercel settings
```

## Backup Strategy

### Code Backup
- ✅ Already backed up in Git/GitHub

### Database Backup
- ✅ Supabase handles automatically
- 📅 Export manually monthly:
  - Supabase Dashboard > Database > Backups > Export

### Storage Backup
- Use Supabase API to backup storage buckets
- Or manually download from Dashboard > Storage

### Configuration Backup
- Document all environment variables securely
- Keep a copy of all Supabase RLS policies
- Export database schema regularly

## Troubleshooting Deployment Issues

### Build Fails

**Error:** `Module not found`
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error:** `TypeScript errors`
```bash
# Check types
npm run check
```

### Runtime Errors

**Error:** `Cannot connect to Supabase`
- Verify environment variables are set correctly
- Check Supabase project is not paused
- Verify network allows Supabase API requests

**Error:** `White screen / blank page`
- Check browser console for errors
- Verify assets are loading (check Network tab)
- Check that routes are configured correctly

### Performance Issues

**Slow Loading:**
- Check bundle size
- Verify CDN is working
- Check database query performance in Supabase Dashboard

## Cost Estimates

### Free Tier (Suitable for Small Pizzeria)

- **Railway:** Free tier includes:
  - $5/month credit
  - Should be sufficient for low-traffic app
  
- **Supabase:** Free tier includes:
  - 500MB database
  - 1GB file storage
  - 50,000 monthly active users
  - Pauses after 1 week inactivity (upgrade to $25/mo to prevent)

**Total:** $0-30/month

### Paid Tier (Recommended for Production)

- **Railway:** ~$5-10/month
- **Supabase:** $25/month (Pro tier - no pausing)

**Total:** ~$30-35/month

Still cheaper than Bubble's $30/month + more features!

## Security Best Practices

1. **Enable Supabase Auth Email Confirmation**
2. **Use strong RLS policies**
3. **Regularly update dependencies**
   ```bash
   npm audit
   npm audit fix
   ```
4. **Monitor for unusual activity** in Supabase Dashboard
5. **Use Sentry for error tracking**
6. **Regular database backups** (monthly exports)
7. **Keep environment variables secure** (never commit to Git)

## Support After Handoff

If you're handing this off with limited support:

1. **Document all credentials** securely
2. **Create video walkthrough** of deployment process
3. **Set up monitoring** (Sentry)
4. **Test rollback process**
5. **Create FAQ** for common issues
6. **Set up alerts** for critical errors

## Getting Help

- **Supabase Issues:** [supabase.com/support](https://supabase.com/support)
- **Railway Issues:** [railway.app/help](https://railway.app/help)
- **Application Issues:** Check browser console + Sentry

---

**Last Updated:** August 5, 2026  
**Version:** 0.3.1
