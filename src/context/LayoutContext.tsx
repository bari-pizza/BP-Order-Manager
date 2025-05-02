import { createContext } from 'react';

interface LayoutContextProps {
    sideBarRef: React.RefObject<HTMLDivElement> | null;
    setSideBarWidth: (width: string | number) => void;
    sideBarSkeletonRef: React.RefObject<HTMLDivElement> | null;
    setSideBarSkeletonWidth: (width: string | number) => void;
    isMobile: boolean;
    isPWA: boolean;
}

export const LayoutContext = createContext<LayoutContextProps>({
    sideBarRef: null,
    setSideBarWidth: () => {},
    sideBarSkeletonRef: null,
    setSideBarSkeletonWidth: () => {},
    isMobile: false,
    isPWA: false,
});

// for dealing with Sidebar. Only called by Sidebar.tsx
