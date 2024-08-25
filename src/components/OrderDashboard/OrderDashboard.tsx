import { useState, Suspense } from 'react';
import {
    // dummyQueryFn,
    getAllDaysOrders,
    type Drawer,
    type DriverDrawer,
} from '../../supabaseQueries';
import { Button, Divider, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { SideBar, SideBarSkeleton } from '../SideBar';
import { useOrderTicketArea } from './OrderTicketArea/useOrderTicketArea';
import { useBusinessDate } from '../../dataHooks/useBusinessDate';
import { useSuspenseQuery } from '@tanstack/react-query';
import { OrderTicketAreaSkeleton } from './OrderTicketArea/OrderTicketArea';
// import { dummyOrders } from '../../dummyData';
import { dayjsToMDY } from '../../utils';

export const OrderDashboard = () => {
    const [businessDate] = useBusinessDate();
    const MDY = dayjsToMDY(businessDate);
    const { data: orders } = useSuspenseQuery({
        queryKey: ['orders', businessDate.format('MM/DD/YYYY')],
        queryFn: () => getAllDaysOrders(MDY),
        // queryFn: () =>
        //     dummyQueryFn({
        //         data: dummyOrders.existing.slice(0, 10),
        //         timeout: 10,
        //     }),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(null);
    const { orderEditor, addOrderButton } = useOrderEditor();
    const { orderTicketArea, toggleTicketsButton } = useOrderTicketArea({ orders });

    // TODO: create a useArrayToggle hook and use it for the order ticket area's collapsedTickets and selectedTickets
    // TODO: bring collapsedTickets and selectedTickets OrderDashboardContext instead
    // TODO: that should allow the user to add tickets to a drawer by clicking on it

    return (
        <OrderDashboardContext.Provider value={{ openDrawer, setOpenDrawer }}>
            <Stack direction="column" sx={{ height: '100vh', overflowY: 'hidden' }} mt={2}>
                <Suspense fallback={<DrawerHeaderSkeleton />}>
                    <DrawerHeader />
                </Suspense>
                <Divider />
                <QuickInfoArea />
                <Divider />
                <Suspense fallback={<OrderTicketAreaSkeleton />}>{orderTicketArea}</Suspense>
            </Stack>
            <SideBar width="300px">
                <Stack alignContent="center" justifyContent="space-between" direction="column" height="100%">
                    <Stack>{orderEditor}</Stack>
                    <Stack direction="column" m={2} gap={2}>
                        {addOrderButton}
                        {toggleTicketsButton}
                    </Stack>
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
