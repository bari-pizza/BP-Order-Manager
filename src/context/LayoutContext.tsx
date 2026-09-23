import { createContext } from 'react';
import type { AppShell } from '../utils/appShell';

interface LayoutContextProps {
    sideBarRef: React.RefObject<HTMLDivElement> | null;
    setSideBarWidth: (width: string | number) => void;
    sideBarSkeletonRef: React.RefObject<HTMLDivElement> | null;
    setSideBarSkeletonWidth: (width: string | number) => void;
    isMobile: boolean;
    /** True when `(display-mode: standalone)` — installed PWA only, not Capacitor. */
    isPWA: boolean;
    /** Capacitor iOS/Android or installed PWA (not a plain browser tab). */
    isInstalledShell: boolean;
    appShell: AppShell;
}

export const LayoutContext = createContext<LayoutContextProps>({
    sideBarRef: null,
    setSideBarWidth: () => {},
    sideBarSkeletonRef: null,
    setSideBarSkeletonWidth: () => {},
    isMobile: false,
    isPWA: false,
    isInstalledShell: false,
    appShell: 'browser',
});

// for dealing with Sidebar. Only called by Sidebar.tsx
