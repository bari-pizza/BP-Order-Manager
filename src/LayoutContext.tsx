import { createContext } from 'react';

interface LayoutContextProps {
    sideBarRef: React.RefObject<HTMLDivElement> | null;
}

export const LayoutContext = createContext<LayoutContextProps>({
    sideBarRef: null,
});
