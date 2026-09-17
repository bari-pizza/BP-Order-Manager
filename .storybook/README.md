# Storybook

Component gallery for Bari Pizza Order Manager.

```bash
npm run storybook
```

Opens [http://localhost:6006](http://localhost:6006) (also startable from the local-dev-dashboard **Storybook** service).

## How to tweak props live

1. Open a story under **Foundation** or **Shop** (start with `Foundation / RoundImage / Playground`).
2. Open the **Controls** panel at the bottom of the canvas (or press `A` then pick Controls).
3. Change size / bump / badge count — the preview updates immediately.

Stories that are layout demos (NavBar, Home, galleries) disable Controls on purpose; use the arg-driven **Playground** stories for interviews.

Sidebar groups: **Foundation** → **Shop** → **Layout** → **Pages**.
