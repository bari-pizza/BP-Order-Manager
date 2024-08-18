import { useState, useContext, Suspense, useEffect } from 'react';
import type { Drawer, DriverDrawer } from '../../supabaseQueries';
import { Button, Divider, Stack } from '@mui/material';
import { Portal } from '@mui/base';
import { OrderDashboardContext } from './OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { OrderTicketArea } from './OrderTicketArea';
import { LayoutContext } from '../../context/LayoutContext';
import { useOrderEditor } from './OrderEditor/useOrderEditor';

export const OrderDashboard = () => {
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(null);
    const { sideBarRef, setSideBarWidth } = useContext(LayoutContext);
    const { orderEditor, open, setOpen } = useOrderEditor();

    useEffect(() => {
        setSideBarWidth('300px');
        return () => setSideBarWidth('0px');
    }, [setSideBarWidth]);

    const toggleOrderEditor = () => {
        setOpen((prev) => !prev);
    };

    return (
        <OrderDashboardContext.Provider value={{ openDrawer, setOpenDrawer }}>
            <Stack direction="column" sx={{ height: '100%' }} mt={2}>
                <Suspense fallback={<DrawerHeaderSkeleton />}>
                    <DrawerHeader />
                </Suspense>
                <Divider />
                <QuickInfoArea />
                <Divider />
                <OrderTicketArea />
                <Portal container={sideBarRef?.current}>
                    <Stack>
                        {!open && <Button onClick={toggleOrderEditor}>Add Order</Button>}
                        {orderEditor}
                    </Stack>
                </Portal>
            </Stack>
        </OrderDashboardContext.Provider>
    );
};
