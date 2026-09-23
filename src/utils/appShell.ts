import { Capacitor } from '@capacitor/core';

/** How the UI is hosted: Capacitor native shell, installed PWA, or regular browser tab. */
export type AppShell = 'ios' | 'android' | 'pwa' | 'browser';

/**
 * Detect the current app shell.
 * Capacitor WKWebView does not reliably match `(display-mode: standalone)`, so native
 * must be checked via Capacitor — not only the PWA media query.
 *
 * Pass `isStandalonePwa` from `useMediaQuery('(display-mode: standalone)')` when available
 * so React stays in sync with the hook; otherwise falls back to `matchMedia`.
 */
export const resolveAppShell = (isStandalonePwa?: boolean): AppShell => {
    if (Capacitor.isNativePlatform()) {
        return Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
    }
    const standalone =
        isStandalonePwa ??
        (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches);
    return standalone ? 'pwa' : 'browser';
};

export const getAppShell = (): AppShell => resolveAppShell();

export const isInstalledShell = (shell: AppShell = getAppShell()): boolean => shell !== 'browser';

/** Short line for the Current Version / environment dialog. */
export const formatAppShellLabel = (shell: AppShell): string => {
    switch (shell) {
        case 'ios':
            return 'Running as iOS app';
        case 'android':
            return 'Running as Android app';
        case 'pwa':
            return 'Running in PWA mode';
        case 'browser':
            return 'Running in browser (not installed)';
    }
};
