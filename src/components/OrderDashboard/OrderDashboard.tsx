import { useState, Suspense } from 'react';
import type { Drawer, DriverDrawer } from '../../supabaseQueries';
import { Button, Divider, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { OrderTicketArea } from './OrderTicketArea';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { SideBar } from '../SideBar';

export const OrderDashboard = () => {
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(null);
    const { orderEditor, open, setOpen } = useOrderEditor();

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
                <SideBar width="300px">
                    <Stack>
                        {!open && <Button onClick={toggleOrderEditor}>Add Order</Button>}
                        {orderEditor}
                    </Stack>
                </SideBar>
            </Stack>
        </OrderDashboardContext.Provider>
    );
};
