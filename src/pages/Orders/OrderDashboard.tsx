import { Suspense } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { SideBar, SideBarSkeleton } from '../../components/SideBar';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { OrderTicketArea, OrderTicketAreaSkeleton } from './OrderTicketArea';
import { useDrivers } from '../../hooks/data/useDrivers';
import { useDialogProps } from '../../hooks/ui/useDialogProps';

export const OrderDashboard = () => {
    const { drivers } = useDrivers();
    const { open, close, isOpen } = useDialogProps();
    const { ticket, drawer, orders, summaries } = useOrdersDrawersTickets();

    return (
        <OrderDashboardContext.Provider value={{ ticket, drawer, orders, drivers, summaries }}>
            <Stack direction="column" sx={{ height: '100vh', overflowY: 'hidden' }} mt={2}>
                <Suspense fallback={<DrawerHeaderSkeleton />}>
                    <DrawerHeader />
                </Suspense>
                <Divider />
                <Suspense fallback={<OrderTicketAreaSkeleton />}>
                    <OrderTicketArea />
                </Suspense>
            </Stack>
            <SideBar width="300px">
                <Stack alignContent="center" justifyContent="center" direction="column" height="100%">
                    <OrderEditor close={close} isOpen={isOpen} forNewOrder />
                    <Stack direction="column" m={2} gap={2}>
                        {!isOpen && (
                            <>
                                {ticket.all.count > 0 && (
                                    <>
                                        <Button variant="contained" onClick={ticket.all.select}>
                                            {ticket.none.areSelected ? 'Select' : 'Unselect'} All
                                        </Button>
                                    </>
                                )}
                                <Button variant="contained" onClick={open}>
                                    Add Order
                                </Button>
                            </>
                        )}
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
            <OrderTicketAreaSkeleton />
            <SideBarSkeleton width="300px">
                <Button disabled>Add Order</Button>
                <Button disabled>Toggle Tickets</Button>
            </SideBarSkeleton>
        </Stack>
    );
};
