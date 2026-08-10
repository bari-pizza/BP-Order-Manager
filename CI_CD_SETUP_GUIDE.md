# CI/CD Setup for Bari Pizza Order Manager

## Current State
- ❌ No build checks before deploy
- ❌ Direct pushes to `main` deploy immediately
- ❌ Failed builds discovered only on Vercel (too late!)

## Recommended CI/CD Setup

### 1. **GitHub Actions for PR Checks** (Free & Easy)

Create `.github/workflows/pr-checks.yml`:

```yaml
name: PR Checks

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run TypeScript check
        run: npm run build
      
      - name: Run linter (if you have one)
        run: npm run lint
        continue-on-error: true
      
      - name: Run tests (if you have them)
        run: npm test
        continue-on-error: true
```

### 2. **Branch Protection Rules**

In GitHub repo settings → Branches → Add rule for `main`:

#### ✅ **Enable These:**
- [x] Require a pull request before merging
  - [x] Require approvals: 0 (or 1 if you want manual review)
  - [x] Require status checks to pass before merging
    - [x] `build-and-test` (from GitHub Actions)
  - [ ] Require conversation resolution before merging
- [x] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings (optional - you can always force if needed)

#### **This prevents:**
- ❌ Pushing directly to `main` (must use PRs)
- ❌ Merging PRs with failed builds
- ❌ Vercel deploying broken code

### 3. **Vercel Integration**

Vercel already:
- ✅ Auto-deploys on `main` push
- ✅ Creates preview deploys for PRs
- ✅ Runs build checks

**But** with PR protection, failed builds never reach Vercel!

### 4. **Workflow**

#### With CI/CD:
```
1. Create branch: cursor/feature-abc-ed73
2. Make changes
3. Open PR
4. GitHub Actions runs:
   - npm install
   - npm run build ← CATCHES ERRORS HERE
   - npm run lint
   - npm test
5. If passes → merge to main
6. Vercel deploys from main
```

#### Current (No CI/CD):
```
1. Push to main
2. Vercel builds
3. Build fails ← ERROR DISCOVERED HERE (too late!)
4. Email notification
5. Fix and push again
```

---

## Quick Setup Commands

Want me to set this up for you? I can:

1. ✅ Create `.github/workflows/pr-checks.yml`
2. ✅ Create a PR template
3. ✅ Document the workflow in CONTRIBUTING.md
4. 📋 Give you instructions for GitHub branch protection settings

**Note:** I can't change GitHub repo settings directly (requires GitHub UI or API token), but I can create all the config files and give you the exact steps.

---

## Cost: **$0** (GitHub Actions free tier)

- Free tier: 2,000 minutes/month
- Your builds take ~30 seconds
- = ~4,000 builds/month for free! 🎉

---

## Alternative: Just Test Locally

You can also just remember to run:
```bash
npm run build
```

Before pushing. But CI/CD is better because:
- ✅ Never forget
- ✅ Catches errors in PRs before merge
- ✅ Runs on every commit automatically
- ✅ Team members can't bypass

---

**Want me to set it up?** Just say "yes" and I'll create all the config files! 🚀
