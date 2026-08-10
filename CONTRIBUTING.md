# Contributing to Bari Pizza Order Manager

Thank you for contributing! This guide will help you get started.

---

## 🚀 Development Workflow

### 1. **Clone and Setup**

```bash
git clone https://github.com/bari-pizza/BP-Order-Manager.git
cd BP-Order-Manager
npm install
```

### 2. **Create a Branch**

```bash
git checkout -b cursor/your-feature-name-ed73
```

**Branch Naming:**
- Use prefix: `cursor/`
- Use suffix: `-ed73`
- Use kebab-case
- Be descriptive: `cursor/fix-origin-save-bug-ed73`

### 3. **Make Changes**

```bash
npm run dev        # Start dev server
npm run build      # Test production build
npm run lint       # Check code style
```

### 4. **Test Before Committing**

**ALWAYS run these before pushing:**

```bash
npm run build      # Must pass!
npm run lint       # Should have no errors
```

If `npm run build` fails, **DO NOT push**. Fix errors first.

### 5. **Commit Changes**

```bash
git add .
git commit -m "Clear, descriptive commit message"
```

**Good commit messages:**
- ✅ "Fix: Origins not saving to database"
- ✅ "Add: Bulk editing for Origins table"
- ✅ "Refactor: Improve type safety in OrderTicket"

**Bad commit messages:**
- ❌ "fix"
- ❌ "update"
- ❌ "changes"

### 6. **Push and Create PR**

```bash
git push -u origin cursor/your-feature-name-ed73
```

Then create a Pull Request on GitHub.

---

## 🔒 Branch Protection

The `main` branch is protected:

- ✅ Requires PR (no direct pushes)
- ✅ Requires build to pass
- ✅ Auto-deploys on merge

**This means:**
- You cannot push directly to `main`
- PRs with failed builds cannot be merged
- CI/CD runs automatically on every PR

---

## 🤖 CI/CD Pipeline

When you open a PR, GitHub Actions automatically:

1. **Installs dependencies** (`npm ci`)
2. **Runs build** (`npm run build`)
3. **Runs linter** (`npm run lint`)
4. **Runs tests** (`npm test`)

**If build fails:**
- ❌ PR is blocked from merging
- ❌ You'll see a red ❌ on the PR
- ✅ Fix errors and push again

**If build passes:**
- ✅ PR is ready to merge
- ✅ You'll see a green ✓ on the PR

---

## 📝 Code Style

### TypeScript

- **Use types** - Avoid `any`
- **Handle nulls** - Use optional chaining (`?.`)
- **No non-null assertions** - Avoid `!` after `.find()`

**Good:**
```typescript
const origin = origins.find(o => o.id === id);
if (!origin) return;
// Use origin safely
```

**Bad:**
```typescript
const origin = origins.find(o => o.id === id)!; // Crashes if not found
```

### React

- Use functional components
- Use hooks (`useState`, `useEffect`, etc.)
- Keep components small and focused

### Imports

- Use relative imports for local files
- Group imports: external → internal → components

---

## 🧪 Testing

### Manual Testing

1. **Test locally**
   ```bash
   npm run dev
   ```

2. **Test production build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Check browser console** - No errors!

### Automated Testing

We use GitHub Actions for automated checks:
- Build verification
- Type checking
- Linting

---

## 🐛 Debugging Failed Builds

If your PR build fails:

1. **Check the GitHub Actions log**
   - Click "Details" next to the failed check
   - Read the error message

2. **Reproduce locally**
   ```bash
   npm run build
   ```

3. **Fix the errors**
   - TypeScript errors → Fix type issues
   - Build errors → Check imports, syntax
   - Lint errors → Run `npm run lint -- --fix`

4. **Push fix**
   ```bash
   git add .
   git commit -m "Fix: Build errors"
   git push
   ```

5. **CI re-runs automatically** ✅

---

## 📦 Deployment

### Automatic Deployment

- **PR created** → Vercel creates preview deployment
- **PR merged to main** → Vercel deploys to production
- **URL:** https://bp-order-manager-flax.vercel.app

### Manual Deployment

Not needed - everything is automatic!

---

## 🔑 Environment Variables

Required for development:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SENTRY_DSN=your-sentry-dsn  # Optional for production only
```

**Never commit `.env` files!** (already in `.gitignore`)

---

## 🆘 Getting Help

- **Build failing?** Run `npm run build` locally to see errors
- **Type errors?** Check TypeScript messages carefully
- **Questions?** Ask in PR comments or team chat

---

## 🎯 Quick Reference

```bash
# Setup
npm install

# Development
npm run dev          # Start dev server
npm run build        # Test production build
npm run preview      # Preview production build
npm run lint         # Check code style

# Git workflow
git checkout -b cursor/feature-name-ed73
git add .
git commit -m "Descriptive message"
git push -u origin cursor/feature-name-ed73

# Before pushing
npm run build        # ← MUST PASS!
```

---

**Remember:** Always run `npm run build` before pushing! 🚀
