import { useState, Suspense } from 'react';
import {
    // dummyQueryFn,
    getAllDaysOrders,
    addOrdersToDrawer,
    removeOrdersFromDrawer,
} from '../../supabaseQueries';
import { Drawer, DriverDrawer } from '../../typesAndValidators';
import { Button, Divider, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { SideBar, SideBarSkeleton } from '../SideBar';
import { useOrderTicketArea } from './OrderTicketArea/useOrderTicketArea';
import { useBusinessDate } from '../../dataHooks/useBusinessDate';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { OrderTicketAreaSkeleton } from './OrderTicketArea/OrderTicketArea';
import { dayjsToMDY } from '../../utils';

export const OrderDashboard = () => {
    const [businessDate] = useBusinessDate();
    const MDY = dayjsToMDY(businessDate);
    const { data: orders } = useSuspenseQuery({
        queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
        queryFn: () => getAllDaysOrders(MDY),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(null);
    const { orderEditor, addOrderButton } = useOrderEditor();
    const drawersOrders = orders?.filter((order) => order.drawer_id === (openDrawer ? openDrawer.drawer_id : null));
    const { orderTicketArea, toggleTicketsButton, selectedTickets, setSelectedTickets } = useOrderTicketArea({
        orders: drawersOrders,
    });

    const queryClient = useQueryClient();

    const assignOrdersToDrawerMutation = useMutation({
        mutationFn: ({ drawerID, orderIDs }: { drawerID: string; orderIDs: string[] }) =>
            addOrdersToDrawer({ drawerID, orderIDs }),
        // TODO: error is being thrown but onSuccess is being called
        onSuccess: (data: string[]) => {
            console.log({ data });
            // should be ids of orders that were successfully updated
            setSelectedTickets((prev) => prev.filter((id) => !data.includes(id)));
            queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
        },
        onError: (error) => {
            console.error(`Issue updating order(s): "${error}"`, error);
        },
    });

    const unassignOrdersFromDrawerMutation = useMutation({
        mutationFn: ({ drawerID, orderIDs }: { drawerID: string; orderIDs: string[] }) =>
            removeOrdersFromDrawer({ drawerID, orderIDs }),
        onSuccess: (data: string[]) => {
            console.log({ data });
            // should be ids of orders that were successfully updated
            setSelectedTickets((prev) => prev.filter((id) => !data.includes(id)));
            queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
        },
        onError: (error) => {
            console.error(`Issue updating order(s): "${error}"`, error);
        },
    });

    const toggleDrawerOpen = (drawer: Drawer | DriverDrawer) => {
        if (openDrawer === drawer) {
            setOpenDrawer(null);
        } else {
            setOpenDrawer(drawer);
        }
    };

    const putTicketsInDrawer = ({ drawerID }: { drawerID: string }) => {
        console.log('putting tickets in drawer', { selectedTickets, drawerID });
        assignOrdersToDrawerMutation.mutate({ drawerID, orderIDs: selectedTickets });
    };

    const removeTicketsFromDrawer = ({ drawerID }: { drawerID: string }) => {
        console.log('removing tickets from drawer', { selectedTickets, drawerID });
        unassignOrdersFromDrawerMutation.mutate({ drawerID, orderIDs: selectedTickets });
    };

    const handleDrawerClick = (drawer: Drawer | DriverDrawer) => {
        if (selectedTickets.length > 0) {
            putTicketsInDrawer({ drawerID: drawer.drawer_id });
        } else {
            toggleDrawerOpen(drawer);
        }
    };

    return (
        <OrderDashboardContext.Provider value={{ openDrawer, handleDrawerClick, removeTicketsFromDrawer }}>
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
                        Open Drawer is {openDrawer?.drawer_id || 'none'}
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
