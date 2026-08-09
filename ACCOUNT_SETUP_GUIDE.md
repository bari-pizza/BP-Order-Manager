# Account Setup Guide - Bari Pizza Order Manager
**Email to use:** `ccata002+baripizza@gmail.com`

## 🎯 Quick Overview

You'll be setting up **3 accounts** (all have free tiers):
1. **Supabase** - Database & Authentication (5 minutes)
2. **Vercel** - Hosting & Deployment (3 minutes)
3. **Sentry** - Error Monitoring (3 minutes)

**Total Time:** ~15 minutes  
**Total Cost:** $0/month (all on free tiers)

---

## 📝 Setup Order (Follow in This Sequence)

### 1️⃣ Supabase Setup (Database & Auth)
**Time:** 5 minutes  
**URL:** https://supabase.com

#### Steps:

1. **Sign Up**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with **GitHub** (recommended) or email: `ccata002+baripizza@gmail.com`
   - Verify email if needed

2. **Create New Project**
   - Click "New Project"
   - **Organization:** Create new one called "Bari Pizza"
   - **Project Name:** `bari-pizza-order-manager`
   - **Database Password:** Generate a strong password (you'll need this!)
     - **SAVE THIS PASSWORD** in a password manager!
   - **Region:** Choose closest to you (e.g., `East US` or `West US`)
   - Click "Create new project"
   - ⏳ Wait 2-3 minutes for provisioning

3. **Get Your Credentials**
   - Once provisioned, go to **Settings** (gear icon) → **API**
   - Copy these two values (you'll need them later):
     - ✅ **Project URL** (looks like: `https://abcdefgh.supabase.co`)
     - ✅ **anon/public key** (long string starting with `eyJ...`)
   - **SAVE THESE** - you'll add them to Vercel later

4. **Set Up Database Schema**
   - Go to **SQL Editor** in left sidebar
   - Click "New query"
   - **Important:** You'll need to run your database migration scripts here
   - For now, just note this location - you'll come back after deployment

5. **Create Storage Buckets**
   - Go to **Storage** in left sidebar
   - Create three buckets:
     1. **avatars** - For user profile pictures
        - Public bucket: ✅ Yes
     2. **order_origins** - For DoorDash, UberEats logos
        - Public bucket: ✅ Yes
     3. **resources** - For general files
        - Public bucket: ✅ Yes

6. **Configure Authentication**
   - Go to **Authentication** → **Providers**
   - Ensure **Email** is enabled
   - **Email Confirmation:** Enable if you want users to confirm emails
   - **Site URL:** You'll update this after Vercel deployment

✅ **Supabase Setup Complete!**

---

### 2️⃣ Vercel Setup (Hosting)
**Time:** 3 minutes  
**URL:** https://vercel.com

#### Steps:

1. **Sign Up**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up"
   - **Sign up with GitHub** (recommended)
   - Authorize Vercel to access your repositories

2. **Import Your GitHub Repository**
   - Click "Add New..." → "Project"
   - Find and select: `bari-pizza/BP-Order-Manager`
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `.` (leave as default)
   - **Build Command:** `npm run build` (should auto-fill)
   - **Output Directory:** `dist` (should auto-fill)
   - Click "Environment Variables" to expand

4. **Add Environment Variables**
   Click "Add" for each of these:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project-id.supabase.co` (from Supabase Step 3)
   - Environment: Production, Preview, Development (check all)

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJ...` (your anon key from Supabase Step 3)
   - Environment: Production, Preview, Development (check all)

   **Variable 3:**
   - Name: `VITE_SENTRY_DSN`
   - Value: Leave empty for now (you'll add this after Sentry setup)
   - Environment: Production only

5. **Deploy**
   - Click "Deploy"
   - ⏳ Wait 2-3 minutes for first deployment
   - Once complete, you'll see: 🎉 "Congratulations!"
   - Click "Visit" to see your deployed app
   - Copy your deployment URL (looks like: `https://bp-order-manager.vercel.app`)

6. **Configure Custom Domain (Optional)**
   - Go to your project → Settings → Domains
   - Add your custom domain if you have one
   - Follow DNS configuration instructions
   - SSL is automatic

7. **Enable Automatic Deployments**
   - Already enabled! Every push to `main` will auto-deploy
   - Pull requests get preview deployments automatically

✅ **Vercel Setup Complete!**

---

### 3️⃣ Sentry Setup (Error Monitoring)
**Time:** 3 minutes  
**URL:** https://sentry.io

#### Steps:

1. **Sign Up**
   - Go to [sentry.io](https://sentry.io)
   - Click "Get Started"
   - Sign up with **GitHub** (recommended) or email: `ccata002+baripizza@gmail.com`
   - Verify email if needed

2. **Create New Project**
   - After signup, you'll see "Create your first project"
   - **Platform:** Select **React** (search or scroll to find it)
   - **Project Name:** `bari-pizza-order-manager`
   - **Team:** Default (or create "Bari Pizza")
   - Click "Create Project"

3. **Skip the SDK Setup Instructions**
   - You'll see a page with installation instructions
   - **You can skip this!** The app is already configured
   - Just scroll down to find your DSN

4. **Copy Your DSN**
   - Look for a line like:
     ```javascript
     dsn: "https://abc123def@o456789.ingest.sentry.io/789123"
     ```
   - **Copy the DSN URL** (the part in quotes)
   - **SAVE THIS** - you'll add it to Vercel

5. **Go to Settings (Alternative Way to Find DSN)**
   - If you can't find it, go to:
   - **Settings** → **Projects** → **bari-pizza-order-manager** → **Client Keys (DSN)**
   - Copy the DSN from there

6. **Configure Alerts (Optional)**
   - Go to **Alerts** in left sidebar
   - Set up email notifications for errors
   - Recommended: Alert on first error in new release

✅ **Sentry Setup Complete!**

---

### 4️⃣ Connect Sentry to Vercel
**Time:** 1 minute

1. **Go Back to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `bp-order-manager` project
   - Go to **Settings** → **Environment Variables**

2. **Add Sentry DSN**
   - Find `VITE_SENTRY_DSN` (you created it empty earlier)
   - Click "Edit"
   - Paste your Sentry DSN: `https://abc123@o456.ingest.sentry.io/789`
   - **Environment:** Production only (uncheck Preview and Development)
   - Click "Save"

3. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots `...` on the latest deployment
   - Click "Redeploy"
   - Wait 1-2 minutes
   - ✅ Sentry is now active in production!

---

### 5️⃣ Update Supabase with Vercel URL
**Time:** 1 minute

1. **Go Back to Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Select your `bari-pizza-order-manager` project
   - Go to **Authentication** → **URL Configuration**

2. **Add Site URL**
   - **Site URL:** `https://your-app.vercel.app` (your Vercel URL)
   - Click "Save"

3. **Add Redirect URLs (if using custom domain)**
   - **Redirect URLs:** Add both:
     - `https://your-app.vercel.app/**`
     - `https://yourdomain.com/**` (if you have a custom domain)
   - Click "Save"

✅ **All accounts connected!**

---

## 📋 Post-Setup Checklist

### Test Your Deployment

1. **Open Your App**
   - Go to your Vercel URL: `https://your-app.vercel.app`
   - The app should load

2. **Test Supabase Connection**
   - Try to sign up with a test account
   - Check if you get an email confirmation (if enabled)
   - Try to log in

3. **Test Sentry (Optional)**
   - Open browser console (F12)
   - Type: `throw new Error("Test Sentry");`
   - Press Enter
   - Check Sentry dashboard - error should appear in ~30 seconds

4. **Create Admin User**
   - Sign up with your admin email
   - Go to Supabase → **Authentication** → **Users**
   - Find your user
   - Go to Supabase → **Table Editor** → **Profile**
   - Find your profile row
   - Edit: Set `is_admin = true`
   - Now you can access Admin dashboard

---

## 🔑 Credentials Summary

**Save these in your password manager!**

### Supabase
- **URL:** https://supabase.com
- **Email:** `ccata002+baripizza@gmail.com`
- **Project:** `bari-pizza-order-manager`
- **Project URL:** `https://xxxxx.supabase.co`
- **Anon Key:** `eyJxxxx...`
- **Database Password:** `[the password you generated]`

### Vercel
- **URL:** https://vercel.com
- **Email:** `ccata002+baripizza@gmail.com` (or GitHub account)
- **Project:** `bp-order-manager`
- **Production URL:** `https://bp-order-manager.vercel.app`

### Sentry
- **URL:** https://sentry.io
- **Email:** `ccata002+baripizza@gmail.com` (or GitHub account)
- **Project:** `bari-pizza-order-manager`
- **DSN:** `https://xxxxx@sentry.io/xxxxx`

---

## 🚨 Common Issues & Solutions

### Issue: Supabase "Project Paused"
**Solution:** Supabase pauses after 7 days of inactivity (free tier). Just click "Resume" in dashboard. Won't happen with daily usage.

### Issue: Can't Sign Up
**Solution:** 
1. Check browser console for errors
2. Verify Supabase URL and anon key in Vercel
3. Check Supabase → Authentication → Providers → Email is enabled

### Issue: Sentry Not Receiving Errors
**Solution:**
1. Verify `VITE_SENTRY_DSN` is set in Vercel (Production only)
2. Make sure you've redeployed after adding the DSN
3. Test with: `throw new Error("Test");` in browser console
4. Sentry only works in **production builds**, not locally

### Issue: Build Fails on Vercel
**Solution:**
1. Check build logs in Vercel dashboard
2. Common causes:
   - Missing environment variables
   - TypeScript errors (check locally first)
   - Dependency issues (ensure `package-lock.json` is committed)

---

## 💰 Cost Breakdown

### Free Tier Limits (Should Never Hit These)

**Supabase Free:**
- ✅ 500MB database (~50,000 orders)
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ⚠️ Pauses after 7 days of zero activity

**Vercel Free:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS & CDN

**Sentry Free:**
- ✅ 5,000 errors/month
- ✅ 10,000 performance events/month

**Total: $0/month** 🎉

### When You'll Need Paid Plans (Years Away)

**Supabase Pro ($25/month):**
- Only if database exceeds 500MB (years of orders)
- Or you want 24/7 support

**Vercel Pro ($20/month):**
- Only if bandwidth exceeds 100GB/month (very high traffic)

**Sentry Team ($26/month):**
- Only if errors exceed 5,000/month (something is very wrong!)

---

## 📞 Support Contacts

### Supabase Issues
- **Docs:** https://supabase.com/docs
- **Support:** https://supabase.com/support
- **Community:** https://github.com/supabase/supabase/discussions

### Vercel Issues
- **Docs:** https://vercel.com/docs
- **Support:** https://vercel.com/support
- **Community:** https://github.com/vercel/vercel/discussions

### Sentry Issues
- **Docs:** https://docs.sentry.io
- **Support:** https://sentry.io/support
- **Community:** https://discord.gg/sentry

### Application Issues
- **GitHub:** https://github.com/bari-pizza/BP-Order-Manager/issues
- **Check:** Sentry dashboard for real-time errors

---

## 🎯 Next Steps After Setup

1. **Merge PR #85** (Sentry monitoring - if not already merged)
2. **Set up database schema** in Supabase SQL Editor
3. **Create your admin account** and set `is_admin = true`
4. **Add initial data:**
   - Order origins (Phone, DoorDash, UberEats, etc.)
   - App settings (delivery fees, starting cash, etc.)
   - At least one register drawer
5. **Test all workflows:**
   - Admin: Add employees, manage settings
   - Manager: Open day, close day, view reports
   - Driver: Take orders, close drawer
6. **Set up custom domain** (optional)
7. **Train users** on the system

---

## ✅ You're Done!

Your Bari Pizza Order Manager is now:
- ✅ Hosted on Vercel (fast, free, automatic deployments)
- ✅ Connected to Supabase (database, auth, storage)
- ✅ Monitored by Sentry (catch errors before users complain)
- ✅ Ready for production use!

**Last Updated:** August 9, 2026  
**Version:** 0.3.1
