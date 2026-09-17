# Storybook

```bash
npm run storybook
# → http://localhost:6006
```

Also startable from the local-dev-dashboard **Storybook** service.

## Finding Controls (live props)

1. Stay on the **Canvas** tab (not Docs).
2. Open **Foundation → RoundImage → Playground** (or **Shop → DrawerCard → Playground**).
3. Look at the **bottom panel**. You should see tabs like Controls / Actions / Accessibility.
4. If the panel is missing: press **D** (toggle addon panel), or click the square icon in the Storybook toolbar that shows/hides the bottom panel, then click **Controls**.

Change `size`, `bump`, or the image select — the preview updates immediately.

Layout stories: **NavBar → Playground** has signed-in + admin/manager/driver/mobile knobs. **Home → Mobile** uses a phone viewport so the portrait Lottie isn’t crushed.
