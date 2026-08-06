# GitHub Issues to Create

Copy and paste these into GitHub Issues manually. They're organized by priority.

---

## 🔴 PHASE 1: CRITICAL (Must Do Before Handoff)

### Issue 1: Remove console.log statements from production code

**Title:** 🔴 CRITICAL: Remove console.log statements from production code

**Body:**
```markdown
## Priority: 🔴 Critical | Time: 2-3 hours | Phase: 1

## Problem
Found 50+ `console.log`, `console.error`, and `console.warn` statements in production code.

**Impact:**
- Exposes data in browser console
- Hurts performance
- Looks unprofessional
- Could leak sensitive information

## Files Most Affected
- `src/api/orderOrigin.tsx` (4 logs)
- `src/api/resource.tsx` (5 logs)  
- `src/api/order.tsx` (8 logs)
- `src/supabaseQueries.ts` (5 logs)
- Plus 30+ more files

## Action Steps

1. Find all console statements:
```bash
grep -r "console\." src/ --exclude-dir=node_modules > console-logs.txt
```

2. For each occurrence:
   - **Remove** informational logs
   - **Wrap** debug logs: `if (import.meta.env.DEV) console.log(...)`
   - **Replace** error logs with toast notifications

## Success Criteria
✅ Zero console.logs in production build  
✅ Development logs only when `DEV === true`  
✅ Errors shown to users via toast

📖 Reference: `CODE_REVIEW.md` - Console Logs section
```

**Labels:** bug, pre-handoff, technical-debt

---

### Issue 2: Secure test credentials in codebase

**Title:** 🔴 CRITICAL: Secure test credentials in codebase

**Body:**
```markdown
## Priority: 🔴 Critical | Time: 30 min | Phase: 1

## Problem
Hardcoded credentials in `tests/e2e/fullDay.test.ts`:
```typescript
await combinedPages.loginWithCredentials('jrajulialmeida@gmail.com', 'Password1234!');
```

**Risk:** Credentials exposed in git history

## Solution

Move to environment variables:
```typescript
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpass';
await combinedPages.loginWithCredentials(TEST_EMAIL, TEST_PASSWORD);
```

Add to `.env.example`:
```
TEST_USER_EMAIL=your_test_user@example.com
TEST_USER_PASSWORD=your_test_password
```

## Success Criteria
✅ No hardcoded credentials  
✅ Tests pass with env vars  
✅ `.env.example` updated

📖 Reference: `CODE_REVIEW.md` - Security section
```

**Labels:** security, pre-handoff

---

### Issue 3: Review and complete or remove TODOs

**Title:** 🔴 CRITICAL: Review and complete or remove TODOs

**Body:**
```markdown
## Priority: 🔴 Critical | Time: 2 hours | Phase: 1

## Problem
30+ TODO comments indicating incomplete features. Users might expect features that don't work.

## High Priority TODOs

```typescript
// src/pages/Profile/MyAccount.tsx:14
// TODO: Add a way to edit profile

// src/toast/useConfirmationToast.tsx  
// TODO: create a toast.confirmation wrapper

// src/pages/Admin/AdminDashboard.tsx:136
// TODO: show registers, allow reports
```

## Action Steps

1. List all TODOs:
```bash
grep -r "TODO\|FIXME\|HACK" src/ --exclude-dir=node_modules
```

2. For each TODO decide:
   - ✅ Implement if critical
   - 📝 Document as future enhancement  
   - 🗑️ Remove if not needed

## Success Criteria
✅ No TODOs for visible UI features  
✅ Critical features complete or hidden  
✅ Future enhancements documented

📖 Reference: `CODE_REVIEW.md` - Incomplete Features
```

**Labels:** enhancement, pre-handoff, documentation

---

## ⚠️ PHASE 2: IMPORTANT (Recommended for Low Support)

### Issue 4: Add Sentry error monitoring

**Title:** ⚠️ IMPORTANT: Add Sentry error monitoring

**Body:**
```markdown
## Priority: ⚠️ Important | Time: 1 hour | Phase: 2

## Why This Matters
Without monitoring, you won't know when things break. Since you can't provide much support, you need error visibility.

## Setup Steps

1. Create free Sentry account at [sentry.io](https://sentry.io)
2. Install: `npm install @sentry/react @sentry/tracing`
3. Configure in `src/main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 0.1,
  });
}
```

4. Add to `.env.example`: `VITE_SENTRY_DSN=your-dsn`

## Benefits
- Know immediately when errors occur
- See stack traces and context
- Track error frequency
- Free tier: 5,000 errors/month

## Success Criteria
✅ Sentry integrated  
✅ Errors appear in dashboard  
✅ Only tracks production

📖 Reference: `COST_OPTIMIZATION.md`
```

**Labels:** enhancement, monitoring

---

### Issue 5: Test complete deployment end-to-end

**Title:** ⚠️ IMPORTANT: Test complete deployment end-to-end

**Body:**
```markdown
## Priority: ⚠️ Important | Time: 2 hours | Phase: 2

## Why This Matters
Verify the entire deployment process works before handoff.

## Testing Checklist

### Deploy Fresh Instance (1 hour)
- [ ] Create new Supabase project
- [ ] Set up tables and RLS policies
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Seed initial data

### Test All Workflows (1 hour)

**Admin:**
- [ ] Add employee, make driver
- [ ] Add order origin, upload logo
- [ ] Configure settings

**Manager:**
- [ ] Add drivers to today
- [ ] View sales chart
- [ ] Close drawers & business day

**Driver:**
- [ ] Take/edit order
- [ ] Add tips
- [ ] Close drawer

**Mobile:**
- [ ] Install as PWA
- [ ] Test offline mode

### Monitoring
- [ ] Verify Sentry works
- [ ] Set up keep-alive (optional)

## Success Criteria
✅ Complete deployment works  
✅ All workflows tested  
✅ Documentation is accurate  
✅ Confident in setup

📖 Reference: `DEPLOYMENT.md`
```

**Labels:** testing, pre-handoff

---

### Issue 6: Add unit tests for critical business logic

**Title:** ⚠️ IMPORTANT: Add unit tests for critical business logic

**Body:**
```markdown
## Priority: ⚠️ Important | Time: 3 hours | Phase: 2

## Current State
- 138 source files
- Only 1 unit test file
- Good E2E tests, but no unit coverage

## Critical Areas to Test

### 1. Utility Functions (1 hour)
Create `src/utils.test.ts`:
- `formatCurrency` - payment formatting
- `sortOrders` - order sorting logic
- `dayjsToMDY` - date conversion

### 2. Validators (1 hour)
Create `src/typesAndValidators.test.ts`:
- `order_number` validation (1-999)
- `total_in_cents` validation
- `phone` validation

### 3. Critical Hooks (1 hour)
- `useBusinessDate` (expand existing tests)
- `useMobile` - driver calculations
- `useOrdersDrawersTickets` - filtering

## Success Criteria
✅ Core utilities tested  
✅ Validators have coverage  
✅ 5-10 meaningful tests added  
✅ Tests pass: `npm run test`

📖 Reference: `CODE_REVIEW.md` - Testing section
```

**Labels:** testing, enhancement

---

### Issue 7: Improve error messages and handling

**Title:** ⚠️ IMPORTANT: Improve error messages and handling

**Body:**
```markdown
## Priority: ⚠️ Important | Time: 2 hours | Phase: 2

## Problem
Error handling is inconsistent. Many errors just log to console or show no message to users.

## Transform Error Handling

From:
```typescript
catch (error) {
  console.error(error);
  return [];
}
```

To:
```typescript
catch (error) {
  toast.error('Unable to save order. Please check your connection.');
  if (import.meta.env.DEV) console.error('Order failed:', error);
  throw error;
}
```

## Key Areas

**Order Operations:**
- Creating/updating order fails
- Adding to drawer fails

**Drawer Operations:**
- Opening/closing fails
- Cash transfer fails

**Authentication:**
- Login fails
- Session expires
- Permission denied

**Network:**
- Offline mode
- Connection lost

## Success Criteria
✅ All errors show user messages  
✅ Toast notifications consistent  
✅ Users understand what went wrong  
✅ Console only in development

📖 Reference: `CODE_REVIEW.md` - Error Handling
```

**Labels:** enhancement, ux

---

## ✅ PHASE 3: NICE TO HAVE (Polish)

### Issue 8: Create user documentation

**Title:** ✅ Create user documentation (Admin, Manager, Driver guides)

**Body:**
```markdown
## Priority: ✅ Nice to Have | Time: 4 hours | Phase: 3

## Why This Helps
Good documentation = less support burden

## Documentation to Create

### 1. Admin Guide (1.5 hours)
`docs/admin-guide.md`
- Add employees and make them drivers
- Add order origins (DoorDash, UberEats)
- Upload logos
- Configure app settings

### 2. Manager Guide (1.5 hours)
`docs/manager-guide.md`
- Start the day
- Add drivers to work today
- Assign orders
- Close drawers and business day
- View sales reports

### 3. Driver Guide (1 hour)
`docs/driver-guide.md`
- Log in
- Take and edit orders
- Add tips
- Close drawer
- View summary

### 4. Troubleshooting (30 min)
`docs/troubleshooting.md`
- Can't log in
- Order won't save
- Common errors

## Success Criteria
✅ Each role has complete guide  
✅ Common issues documented  
✅ Clear and concise  
✅ Someone can use app with just docs

📖 Reference: `ACTION_PLAN.md` Phase 3
```

**Labels:** documentation, enhancement

---

### Issue 9: Record video tutorials

**Title:** ✅ Record video tutorials for each user role

**Body:**
```markdown
## Priority: ✅ Nice to Have | Time: 2 hours | Phase: 3

## Why This Helps
Videos are easier to follow than docs. Reduces support time significantly.

## Videos to Create

### 1. Admin Setup (5-10 min)
- Initial configuration
- Adding employees
- Adding order origins
- Uploading logos

### 2. Manager Workflow (5-10 min)
- Starting the day
- Adding drivers
- Assigning orders
- Closing the day

### 3. Driver Workflow (5-10 min)
- Logging in
- Taking orders
- Managing tips
- Closing drawer

## Tools
- Loom (free)
- OBS Studio (free)
- Built-in screen recording

## Success Criteria
✅ Three core videos recorded  
✅ Each < 10 minutes  
✅ Clear and easy to follow  
✅ Linked from documentation

📖 Reference: `ACTION_PLAN.md` Phase 3
```

**Labels:** documentation, enhancement

---

### Issue 10: Performance audit with Lighthouse

**Title:** ✅ Performance audit with Lighthouse

**Body:**
```markdown
## Priority: ✅ Nice to Have | Time: 1 hour | Phase: 3

## Why This Helps
Good performance = happy users

## Action Steps

### 1. Run Lighthouse (15 min)
```bash
npm run build
npm run preview
# Chrome DevTools → Lighthouse → Run audit
```

### Target Scores
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 80+

### 2. Review Bundle (15 min)
- Check dist/ folder size
- Review build output for large chunks

### 3. Optimize if Needed (30 min)
- Compress images
- Check for unnecessary dependencies
- Verify lazy loading working
- Check for duplicate code

### 4. Test on Real Devices
- Actual iPhone/Android
- Slow 3G network

## Success Criteria
✅ Lighthouse scores meet targets  
✅ Bundle size reasonable (< 5MB)  
✅ Fast on mobile devices

📖 Reference: `ACTION_PLAN.md` Phase 3
```

**Labels:** performance, enhancement

---

### Issue 11: Code cleanup

**Title:** ✅ Code cleanup: Remove commented code and fix type assertions

**Body:**
```markdown
## Priority: ✅ Nice to Have | Time: 2 hours | Phase: 3

## Why This Helps
Cleaner code = easier maintenance

## Action Steps

### 1. Remove Commented Code (30 min)
- Google Maps integration in `App.tsx`
- Commented imports
- Old replaced code

### 2. Fix Type Assertions (45 min)
Replace `as unknown as Type`:
```typescript
// Bad
return data as unknown as Drawer[];

// Better
const { data } = await supaClient
  .from('Drawer')
  .select('*')
  .returns<Drawer[]>();
return data ?? [];
```

### 3. Add JSDoc Comments (45 min)
Document complex functions:
```typescript
/**
 * Calculates running total
 * @param values - Numeric values
 * @returns Running totals
 */
export const getRunningTotal = (values: number[]) => { ... }
```

## Optional Refactoring
- CRUD hooks (similar patterns)
- Table cell renderers (duplication)
- Dialog management

## Success Criteria
✅ No commented-out code  
✅ Fewer type assertions  
✅ Complex functions documented

📖 Reference: `CODE_REVIEW.md` - Code Cleanup
```

**Labels:** technical-debt, refactoring

---

### Issue 12: Export database schema

**Title:** ✅ Export and document complete database schema

**Body:**
```markdown
## Priority: ✅ Nice to Have | Time: 1 hour | Phase: 3

## Why This Helps
Makes replicating for other pizzerias much easier

## Action Steps

### 1. Export Schema (30 min)
From Supabase Dashboard:
- Database → Schema → Export
- Save as `supabase-functions/schema.sql`

Include:
- All table definitions
- Indexes, foreign keys, triggers
- Custom types (enums)

### 2. Export RLS Policies (15 min)
Document all Row Level Security:
- Database → Policies → Export
- Save as `supabase-functions/rls-policies.sql`

Tables: Profile, Order, Payment, Drawer, BusinessDayDriver, OrderOrigin, Resource, AppSetting, BusinessDaySummary, CashTransfer, Driver

### 3. Export Storage Policies (15 min)
- Storage → Policies → Export
- Save as `supabase-functions/storage-policies.sql`

Buckets: avatars, order_origins, resources

### 4. Create Setup Script (Optional)
`supabase-functions/setup.sql` that:
- Creates all tables
- Sets up RLS
- Creates storage buckets
- Seeds initial data

## Success Criteria
✅ Complete schema exported  
✅ All RLS policies documented  
✅ Storage policies documented  
✅ Can recreate database from files

📖 Reference: `SETUP.md`
```

**Labels:** documentation, database

---

## 📋 MASTER TRACKING ISSUE

### Issue 13: Pre-Handoff Master Checklist

**Title:** 📋 Pre-Handoff Master Checklist - Track Overall Progress

**Body:**
```markdown
## Pre-Handoff Master Checklist

Track overall progress here. Check off items as you complete them.

## Phase 1: Critical (Must Do) - 5-6 hours

- [ ] #[issue] Remove console.log statements (2-3h)
- [ ] #[issue] Secure test credentials (30min)
- [ ] #[issue] Review and complete/remove TODOs (2h)
- [x] Environment setup documentation (✅ Done - PR #66)

## Phase 2: Important (Recommended) - 8 hours

- [ ] #[issue] Add Sentry error monitoring (1h)
- [ ] #[issue] Test deployment end-to-end (2h)
- [ ] #[issue] Add unit tests for critical logic (3h)
- [ ] #[issue] Improve error messages (2h)

## Phase 3: Nice to Have (Polish) - 10 hours

- [ ] #[issue] Create user documentation (4h)
- [ ] #[issue] Record video tutorials (2h)
- [ ] #[issue] Performance audit (1h)
- [ ] #[issue] Code cleanup (2h)
- [ ] #[issue] Export database schema (1h)

## Deployment

- [ ] Deploy to Vercel (free)
- [ ] Configure environment variables
- [ ] Set up Sentry monitoring
- [ ] Set up keep-alive (GitHub Actions)
- [ ] Test all workflows
- [ ] Verify mobile/PWA

## Current Status: 🔴 Not Ready

**Minimum for handoff:** Phase 1 + Sentry + Deployment Testing  
**Time needed:** ~13-14 hours

## Revenue Model

- **Cost:** $0/month (Vercel + Supabase free tiers)
- **Revenue:** $30/month per pizzeria
- **Profit:** $30/month (100% margin!)
- **Annual profit:** $360/year per customer

## Supabase Pricing Context

- **Free:** $0/month - 500MB DB, 1GB storage (enough for years!)
- **Pro:** $25/month - Only if you exceed limits (unlikely)

## References

- [CODE_REVIEW.md](../CODE_REVIEW.md) - Full assessment
- [ACTION_PLAN.md](../ACTION_PLAN.md) - Detailed action plan
- [COST_OPTIMIZATION.md](../COST_OPTIMIZATION.md) - How to maximize profit
- [SETUP.md](../SETUP.md) - Setup guide
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide (Vercel recommended)

---

**Update this as you complete items!** Link issue numbers and check off completed tasks.
```

**Labels:** tracking, pre-handoff

---

## Quick Create Instructions

1. Go to https://github.com/rickcedwhat/BP-Order-Manager/issues/new
2. Copy/paste each issue title and body
3. Add suggested labels (or create your own)
4. Create the issues
5. Update the master tracking issue (#13) with issue numbers

## Suggested Label Scheme

Create these labels in GitHub:
- `pre-handoff` (red) - Must do before customer handoff
- `phase-1-critical` (red) - Highest priority
- `phase-2-important` (orange) - Recommended
- `phase-3-polish` (yellow) - Nice to have
- `technical-debt` (gray)
- `security` (purple)
- `monitoring` (blue)
- `testing` (green)
- `documentation` (light blue)
- `performance` (blue)
- `ux` (pink)
