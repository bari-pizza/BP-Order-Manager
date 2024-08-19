import { useContext, useEffect } from 'react';
import { LayoutContext } from '../context/LayoutContext';
import { Portal } from '@mui/base';

type SideBarProps = {
    width: string | number;
    children?: React.ReactNode;
};

export const SideBar = ({ width, children }: SideBarProps) => {
    const { sideBarRef, setSideBarWidth } = useContext(LayoutContext);
    useEffect(() => {
        setSideBarWidth(width);
        return () => setSideBarWidth('0px');
    }, [setSideBarWidth, width]);
    return <Portal container={sideBarRef?.current}>{children}</Portal>;
};
