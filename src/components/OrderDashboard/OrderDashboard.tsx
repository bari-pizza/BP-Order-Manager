import { useState, Suspense } from 'react';
import { dummyQueryFn, Order, type Drawer, type DriverDrawer } from '../../supabaseQueries';
import { Button, Divider, Drawer as MUIDrawer, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { SideBar } from '../SideBar';
import { useOrderTicketArea } from './OrderTicketArea/useOrderTicketArea';
import { useBusinessDate } from '../../dataHooks/useBusinessDate';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createDummyOrder } from '../../dummyData';
import { OrderTicketAreaSkeleton } from './OrderTicketArea/OrderTicketArea';

const dummyOrders = [
    createDummyOrder(),
    createDummyOrder(),
    createDummyOrder(),
    createDummyOrder(),
    createDummyOrder(),
    createDummyOrder(),
    createDummyOrder(),
    createDummyOrder(),
].sort((a, b) => (a.order_number || 0) - (b.order_number || 0)) as Order[];

// TODO: see how sidebar works in production (is there a flicker)

export const OrderDashboard = () => {
    const [businessDate] = useBusinessDate();
    // const MDY = dayjsToMDY(businessDate);
    console.log('about to call dummyQuery');
    const { data: orders } = useSuspenseQuery({
        queryKey: ['orders', businessDate.format('MM/DD/YYYY')],
        // queryFn: () => getAllDaysOrders(MDY),
        queryFn: () =>
            dummyQueryFn({
                data: dummyOrders,
                timeout: 1,
            }),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
    console.log('got orders', orders);
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(null);
    const { orderEditor, open: openOrderEditor, setOpen: setOpenOrderEditor } = useOrderEditor();
    const { orderTicketArea, toggleAllTickets } = useOrderTicketArea({ orders });

    const toggleOrderEditor = () => {
        setOpenOrderEditor((prev) => !prev);
    };

    console.log('rendering order dashboard sidebar');

    return (
        <OrderDashboardContext.Provider value={{ openDrawer, setOpenDrawer }}>
            <Stack direction="column" sx={{ height: '100%' }} mt={2}>
                <Suspense fallback={<DrawerHeaderSkeleton />}>
                    <DrawerHeader />
                </Suspense>
                <Divider />
                <QuickInfoArea />
                <Divider />
                <Suspense fallback={<OrderTicketAreaSkeleton />}>{orderTicketArea}</Suspense>
                <SideBar width="300px">
                    <Stack id="sidebar-add-order">
                        {!openOrderEditor && <Button onClick={toggleOrderEditor}>Add Order</Button>}
                        {orderEditor}
                    </Stack>
                    <Stack id="sidebar-toggle-tickets">
                        <Button onClick={toggleAllTickets}>Toggle Tickets</Button>
                    </Stack>
                </SideBar>
            </Stack>
        </OrderDashboardContext.Provider>
    );
};

export const OrderDashboardSkeleton = () => {
    return (
        <Stack direction="column" sx={{ height: '100%' }} mt={2}>
            <DrawerHeaderSkeleton />
            <Divider />
            <QuickInfoArea />
            <Divider />
            <OrderTicketAreaSkeleton />
            <MUIDrawer
                sx={{
                    width: 300,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 300,
                        boxSizing: 'border-box',
                    },
                }}
                anchor="right"
                variant="permanent">
                <Button disabled>Add Order</Button>
                <Button disabled>Toggle Tickets</Button>
            </MUIDrawer>
        </Stack>
    );
};
