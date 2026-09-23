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
