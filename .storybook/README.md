# Storybook

```bash
npm run storybook
# → http://localhost:6006
```

Also startable from the local-dev-dashboard **Storybook** service.

## Cash transfers / closing (BAR-38)

| Story | What to check |
| --- | --- |
| **Shop → ClosingSummary → MobileClosing** | Hours popover; Payments detail uses Paid By/To when drawer set |
| **Shop → ClosingSummary → HoursUnset** | No crash |
| **Shop → ClosingSummary → DuplicateClosingPaymentWarning** | Warning banner |
| **Shop → CashTransferEditor → ListRows** | Edit existing → helper “Can't change parties…” |
| **Shop → CashTransferEditor → NewTransferTypePicker** | Bank / Payment / Other |
| **Shop → AddDriverCard → DialogOpen** | `business_date: 2026-09-15` in Actions |

## Finding Controls (live props)

1. Stay on the **Canvas** tab (not Docs).
2. Open **Foundation → RoundImage → Playground** (or **Shop → DrawerCard → Playground**).
3. Look at the **bottom panel**. You should see tabs like Controls / Actions / Accessibility.
4. If the panel is missing: press **D** (toggle addon panel), or click the square icon in the Storybook toolbar that shows/hides the bottom panel, then click **Controls**.

Change `size`, `bump`, or the image select — the preview updates immediately.

Layout: **NavBar → Playground** has signed-in + role knobs. **Home → Playground** has a `device` select (iPhone SE → wide desktop); you can also use the Storybook **viewport** toolbar icon to cycle sizes on any story.

The mobile home Lottie is authored very tall (1550×4025) — lots of sky above the pizza shop is intentional. Horizontal scroll was a real bug (Player only capped height); Home now constrains width too.
