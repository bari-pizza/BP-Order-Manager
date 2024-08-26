import { Suspense } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { SideBar, SideBarSkeleton } from '../SideBar';
import { useOrdersDrawersTickets } from '../../hooks/interactions/useOrdersDrawersTickets';
import { OrderTicketArea, OrderTicketAreaSkeleton } from './OrderTicketArea';

export const OrderDashboard = () => {
    const { orderEditor, addOrderButton } = useOrderEditor();
    const { ticket, drawer, orders } = useOrdersDrawersTickets();

    return (
        <OrderDashboardContext.Provider value={{ ticket, drawer, orders }}>
            <Stack direction="column" sx={{ height: '100vh', overflowY: 'hidden' }} mt={2}>
                <Suspense fallback={<DrawerHeaderSkeleton />}>
                    <DrawerHeader />
                </Suspense>
                <Divider />
                <QuickInfoArea />
                <Divider />
                <Suspense fallback={<OrderTicketAreaSkeleton />}>
                    <OrderTicketArea />
                </Suspense>
            </Stack>
            <SideBar width="300px">
                <Stack alignContent="center" justifyContent="space-between" direction="column" height="100%">
                    <Stack>{orderEditor}</Stack>
                    <Stack direction="column" m={2} gap={2}>
                        {addOrderButton}
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
