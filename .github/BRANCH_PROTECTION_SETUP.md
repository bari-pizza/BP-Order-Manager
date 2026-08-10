# Branch Protection Setup Instructions

**YOU NEED TO DO THIS IN GITHUB UI** (I can't do it via code)

## Step-by-Step Instructions

### 1. Go to Repository Settings

1. Navigate to: https://github.com/bari-pizza/BP-Order-Manager
2. Click **Settings** tab (top right)
3. In left sidebar, click **Branches** (under "Code and automation")

### 2. Add Branch Protection Rule

1. Click **Add rule** button
2. In "Branch name pattern" field, type: `main`

### 3. Configure Protection Settings

**Check these boxes:**

#### ✅ **Require a pull request before merging**
- [x] Require a pull request before merging
  - Set "Required approvals" to: **0** (or 1 if you want manual review)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [ ] Require review from Code Owners (optional)

#### ✅ **Require status checks to pass before merging**
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - **In the search box that appears, type: `build-and-lint`**
  - **Click on `build-and-lint` to add it** (will appear after first PR with CI)

#### ✅ **Other Settings**
- [x] Require conversation resolution before merging (optional, but recommended)
- [ ] Require signed commits (optional)
- [ ] Require linear history (optional)
- [ ] Do not allow bypassing the above settings (optional - leave unchecked so you can force push if needed)

### 4. Save Changes

Click **Create** (or **Save changes**) at the bottom

---

## What This Does

✅ **Prevents direct pushes to main** - Must use Pull Requests
✅ **Requires build to pass** - Can't merge broken code
✅ **Auto-runs CI/CD** - Catches errors before deploy
✅ **Vercel still auto-deploys** - But only working code!

---

## Testing It Works

1. Try to push directly to `main`:
   ```bash
   git push origin main
   ```
   **Should fail** with "protected branch" error ✅

2. Create a PR instead:
   ```bash
   git checkout -b cursor/test-ci-ed73
   echo "test" > test.txt
   git add test.txt
   git commit -m "Test CI"
   git push -u origin cursor/test-ci-ed73
   ```
   Then create PR on GitHub - **CI should run automatically** ✅

---

## Important Notes

- **First PR:** The `build-and-lint` check won't appear in the dropdown until after the first PR runs. That's OK - add it after your first PR completes.
- **Emergency bypass:** If you need to force push (emergency), you can still do so since we didn't check "Do not allow bypassing"
- **Team members:** Anyone with write access can create PRs, but only admins can merge

---

## Status: ⚠️ **ACTION REQUIRED**

I've created all the CI/CD files, but **you must enable branch protection in GitHub UI**.

Without it, builds will run but won't block bad code from merging.

**Takes 2 minutes, saves hours of debugging!** 🚀
