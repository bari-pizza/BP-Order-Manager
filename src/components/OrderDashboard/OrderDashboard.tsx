import { useState, Suspense } from 'react';
import { dummyQueryFn, Order, type Drawer, type DriverDrawer } from '../../supabaseQueries';
import { Button, Divider, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { SideBar, SideBarSkeleton } from '../SideBar';
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

// TODO: maybe get drawers and drivers at the top level rather than in Order Dashboard
// TODO: would be better if only the ticket area were scrollable and the Header was fixed

export const OrderDashboard = () => {
    const [businessDate] = useBusinessDate();
    // const MDY = dayjsToMDY(businessDate);
    const { data: orders } = useSuspenseQuery({
        queryKey: ['orders', businessDate.format('MM/DD/YYYY')],
        // queryFn: () => getAllDaysOrders(MDY),
        queryFn: () =>
            dummyQueryFn({
                data: dummyOrders,
                timeout: 10,
            }),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(null);
    const { orderEditor, open: openOrderEditor, setOpen: setOpenOrderEditor } = useOrderEditor();
    const { orderTicketArea, toggleAllTickets } = useOrderTicketArea({ orders });

    const toggleOrderEditor = () => {
        setOpenOrderEditor((prev) => !prev);
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
                <Suspense fallback={<OrderTicketAreaSkeleton />}>{orderTicketArea}</Suspense>
            </Stack>
            <SideBar width="300px">
                <Stack id="sidebar-add-order">
                    {!openOrderEditor && <Button onClick={toggleOrderEditor}>Add Order</Button>}
                    {orderEditor}
                </Stack>
                <Stack id="sidebar-toggle-tickets">
                    <Button onClick={toggleAllTickets}>Toggle Tickets</Button>
                </Stack>
            </SideBar>
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
            <SideBarSkeleton width="300px">
                <Button disabled>Add Order</Button>
                <Button disabled>Toggle Tickets</Button>
            </SideBarSkeleton>
        </Stack>
    );
};
