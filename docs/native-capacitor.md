# Capacitor native spike (BAR-37)

Wraps the existing Vite/React app in iOS + Android shells. **Not** a React Native rewrite.

This machine currently has Command Line Tools only — **install full Xcode** (App Store) before you can run the iOS Simulator. Android needs Android Studio.

## One-time setup

```bash
# From repo root (already done on the spike branch):
# npm i @capacitor/core @capacitor/ios @capacitor/android
# npm i -D @capacitor/cli
# npx cap add ios && npx cap add android

# After installing Xcode:
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
# CocoaPods (for iOS deps):
sudo gem install cocoapods   # or: brew install cocoapods
```

## Run on iOS Simulator

From the **repository root**:

```bash
npm run cap:run:ios
# or:
./scripts/run-ios-simulator.sh
```

That rebuilds web assets, syncs into `ios/`, and **launches the Simulator** with the app (no Xcode ▶ click).

Open Xcode only (edit native project, pick a specific device):

```bash
npm run cap:ios
# Xcode opens → pick a Simulator → ▶ Run
```

Live reload against local Vite (Simulator):

```bash
# Terminal 1
npm run dev

# Terminal 2 — rebuild shell pointing at Vite
CAP_SERVER_URL=http://localhost:6309 npx cap sync ios
npx cap open ios
```

Physical device: use your Mac’s LAN IP (`http://192.168.x.x:6309`) and allow cleartext / ATS as needed.

## Test on your iPhone (easiest — no $99 yet)

You can sideload a **debug** build with a free Apple ID. ($99 is only required for TestFlight / App Store / longer-lived distribution.)

1. Plug in the iPhone with a cable → Unlock → **Trust** this computer.
2. From the repo root:
   ```bash
   cd ~/Documents/Projects/BP-Order-Manager
   npm run cap:ios
   ```
3. In Xcode’s device menu (top bar), pick **your iPhone** (not a Simulator).
4. **Signing & Capabilities** on the `App` target:
   - Team → **Add Account…** → sign in with your Apple ID (free is fine)
   - If bundle id collides, change to something unique like `com.baripizza.ordermanager.yourname`
5. Hit **▶ Run**. First time: on the phone go to **Settings → General → VPN & Device Management** → trust your developer cert.
6. App installs and opens. Re-run after `npm run cap:sync` when web code changes.

**Faster iteration (live reload):** Mac and phone on same Wi‑Fi:

```bash
# Terminal 1
npm run dev

# Terminal 2 — replace with your Mac’s LAN IP (System Settings → Network)
CAP_SERVER_URL=http://192.168.1.10:6309 npx cap sync ios
npx cap open ios
# ▶ Run on the phone
```

Phone must reach that IP; if it fails, stick to bundled `cap:sync` (no live reload).

## Run on Android

```bash
npm run cap:android
# Android Studio → device/emulator → Run
```

## What this spike is for

- Feel of “real app” icon / home screen vs Add to Home Screen PWA
- Whether WebView auth + Supabase feel OK
- Cost of a dual release train vs staying on Vercel PWA

## Out of scope for the spike

- App Store / Play listings and signing
- Push notifications
- Deep links / universal links
- Shipping a store build
