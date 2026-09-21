import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Native wrap of the Vite/React app (BAR-37 spike).
 *
 * Bundled mode (default): `npm run build` → `npx cap sync` → open in Xcode / Android Studio.
 * Live reload: set CAP_SERVER_URL to your machine's LAN Vite URL, e.g.
 *   CAP_SERVER_URL=http://192.168.1.10:6309 npx cap run ios
 * (Simulator can use http://localhost:6309; physical devices need the LAN IP.)
 */
const liveReloadUrl = process.env.CAP_SERVER_URL?.trim();

const config: CapacitorConfig = {
    appId: 'com.baripizza.ordermanager',
    appName: 'BP Order Manager',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        ...(liveReloadUrl
            ? {
                  url: liveReloadUrl,
                  cleartext: liveReloadUrl.startsWith('http://'),
              }
            : {}),
    },
};

export default config;
