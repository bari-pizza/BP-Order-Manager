import { useEffect } from 'react';
import { useLayoutContext } from '../hooks/data/useContextData';
import { Portal } from '@mui/base';

type SideBarProps = {
    width: string | number;
    children?: React.ReactNode;
};

export const SideBar = ({ width, children }: SideBarProps) => {
    const { sideBarRef, setSideBarWidth } = useLayoutContext();
    useEffect(() => {
        setSideBarWidth(width);
        return () => setSideBarWidth('0px');
    }, [setSideBarWidth, width]);
    return <Portal container={sideBarRef?.current}>{children}</Portal>;
};

export const SideBarSkeleton = ({ width, children }: SideBarProps) => {
    const { sideBarSkeletonRef, setSideBarSkeletonWidth } = useLayoutContext();
    useEffect(() => {
        setSideBarSkeletonWidth(width);
        return () => setSideBarSkeletonWidth('0px');
    }, [setSideBarSkeletonWidth, width]);
    return <Portal container={sideBarSkeletonRef?.current}>{children}</Portal>;
};
