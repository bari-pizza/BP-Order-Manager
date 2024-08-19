import { useEffect } from 'react';
import { useLayoutContext } from '../dataHooks/useContextData';
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
