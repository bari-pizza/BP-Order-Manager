import { createContext } from 'react';

interface LayoutContextProps {
    sideBarRef: React.RefObject<HTMLDivElement> | null;
    setSideBarWidth: (width: string | number) => void;
    sideBarSkeletonRef: React.RefObject<HTMLDivElement> | null;
    setSideBarSkeletonWidth: (width: string | number) => void;
}

export const LayoutContext = createContext<LayoutContextProps>({
    sideBarRef: null,
    setSideBarWidth: () => {},
    sideBarSkeletonRef: null,
    setSideBarSkeletonWidth: () => {},
});
