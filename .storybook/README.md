# Storybook

```bash
npm run storybook
# → http://localhost:6006
```

Also startable from the local-dev-dashboard **Storybook** service.

## Cash transfers / closing (BAR-38 P0 / P1)

| Story | What to check |
| --- | --- |
| **Shop → ClosingSummary → MobileClosing** | Hours info popover shows `N hours @ $rate` (not blank) |
| **Shop → ClosingSummary → HoursUnset** | No crash; Hours line still renders |
| **Shop → ClosingSummary → DuplicateClosingPaymentWarning** | Warning banner + Payments detail |
| **Shop → CashTransferEditor → ListRows** | Collapsed labels use title or Bank/Payment/Other (not raw enum) |
| **Shop → CashTransferEditor → ClosingPaymentNew** | Direction button shows From/To label; Register Autocomplete label |
| **Shop → CashTransferEditor → NewTransferTypePicker** | Buttons say Bank / Payment / Other |
| **Shop → AddDriverCard → DialogOpen** | Submit with bank; Actions → `business_date: 2026-09-15` |

## Finding Controls (live props)

1. Stay on the **Canvas** tab (not Docs).
2. Open **Foundation → RoundImage → Playground** (or **Shop → DrawerCard → Playground**).
3. Look at the **bottom panel**. You should see tabs like Controls / Actions / Accessibility.
4. If the panel is missing: press **D** (toggle addon panel), or click the square icon in the Storybook toolbar that shows/hides the bottom panel, then click **Controls**.

Change `size`, `bump`, or the image select — the preview updates immediately.

Layout: **NavBar → Playground** has signed-in + role knobs. **Home → Playground** has a `device` select (iPhone SE → wide desktop); you can also use the Storybook **viewport** toolbar icon to cycle sizes on any story.

The mobile home Lottie is authored very tall (1550×4025) — lots of sky above the pizza shop is intentional. Horizontal scroll was a real bug (Player only capped height); Home now constrains width too.
