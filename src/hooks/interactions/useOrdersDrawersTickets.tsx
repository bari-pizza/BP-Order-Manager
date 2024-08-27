import { useState } from 'react';
import type { Drawer, DriverDrawer, Order } from '../../typesAndValidators';
import { addOrdersToDrawer, getAllDaysOrders, removeOrdersFromDrawer } from '../../supabaseQueries';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useBusinessDate } from '../data/useBusinessDate';
import { dayjsToMDY } from '../../utils';

const unassignedDrawer: Drawer = {
    drawer_id: 'unassigned',
    name: 'Unassigned',
    created_at: '2024-08-27T00:00:00.000Z',
    drawer_type: 'unassigned',
};

export const useOrdersDrawersTickets = () => {
    const [businessDate] = useBusinessDate();
    const MDY = dayjsToMDY(businessDate);
    const { data: allOrders } = useSuspenseQuery({
        queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
        queryFn: () => getAllDaysOrders(MDY),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });

    // const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(null);
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer>(unassignedDrawer);
    // const orders = allOrders?.filter((order) => order.drawer_id === (openDrawer ? openDrawer.drawer_id : null));
    const orders = allOrders?.filter(
        (order) => order.drawer_id === (openDrawer.drawer_id === 'unassigned' ? null : openDrawer.drawer_id),
    );
    const ordersByDrawer = allOrders?.reduce((acc: { [key: string]: Order[] }, order) => {
        const key = order.drawer_id ?? 'unassigned';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(order);
        return acc;
    }, {});
    const [collapsedTickets, setCollapsedTickets] = useState<string[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

    const orderCount = orders?.length ?? 0;

    const allCollapsed = collapsedTickets.length === orderCount;
    const allSelected = selectedTickets.length === orderCount;

    const noneCollapsed = collapsedTickets.length === 0;
    const noneSelected = selectedTickets.length === 0;

    const toggleCollapsedTicket = (order: Order) => {
        setCollapsedTickets((prev) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((id) => id !== order.order_id);
            }
            return [...prev, order.order_id];
        });
    };

    const toggleSelectedTicket = (order: Order) => {
        setSelectedTickets((prev) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((id) => id !== order.order_id);
            }
            return [...prev, order.order_id];
        });
    };

    const toggleCollapseAllTickets = () => {
        if (allCollapsed) {
            setCollapsedTickets([]);
        } else {
            setCollapsedTickets(orders?.map((order) => order.order_id) || []);
        }
    };

    const toggleSelectAllTickets = () => {
        if (allSelected) {
            setSelectedTickets([]);
        } else {
            setSelectedTickets(orders?.map((order) => order.order_id) || []);
        }
    };

    const toggleDrawerOpen = (drawer: Drawer | DriverDrawer) => {
        if (openDrawer === drawer) {
            // setOpenDrawer(null);
            setOpenDrawer(unassignedDrawer);
        } else {
            setOpenDrawer(drawer);
        }
    };

    const queryClient = useQueryClient();

    const assignOrdersToDrawerMutation = useMutation({
        mutationFn: ({ drawerID, orderIDs }: { drawerID: string; orderIDs: string[] }) =>
            addOrdersToDrawer({ drawerID, orderIDs }),
        onSuccess: ({ updated_order_ids, errors }: { updated_order_ids: string[]; errors: string[] }) => {
            // should be ids of orders that were successfully updated
            // do something with errors here
            console.log({ updated_order_ids, errors });
            // setSelectedTickets((prev) => prev.filter((id) => !updated_order_ids.includes(id)));
            // remove all selectedTickets (even on failure)
            setSelectedTickets([]);
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

    const putTicketsInDrawer = (drawer: Drawer | DriverDrawer) => {
        const drawerID = drawer.drawer_id;
        console.log('putting tickets in drawer', { selectedTickets, drawerID });
        assignOrdersToDrawerMutation.mutate({ drawerID, orderIDs: selectedTickets });
    };

    const removeTicketsFromDrawer = () => {
        const drawerID = openDrawer.drawer_id;
        console.log('removing tickets from drawer', { selectedTickets, drawerID });
        unassignOrdersFromDrawerMutation.mutate({ drawerID, orderIDs: selectedTickets });
    };

    // TODO: add toaster for errors when putting tickets in drawer
    // TODO: create little animation of putting tickets in drawer

    // 5 Tickets added to drawer
    // Ticket unable to be put in drawer

    const handleDrawerClick = (drawer: Drawer | DriverDrawer) => {
        if (selectedTickets.length > 0) {
            if (drawer.drawer_id === openDrawer.drawer_id) {
                setSelectedTickets([]);
            } else if (drawer.drawer_id === 'unassigned') {
                removeTicketsFromDrawer();
                return;
            } else {
                putTicketsInDrawer(drawer);
                return;
            }
        }
        toggleDrawerOpen(drawer);
    };

    const getOrdersByDrawerID = (drawerID?: string) => {
        if (!drawerID) {
            return ordersByDrawer['unassigned'];
        }
        if (drawerID in ordersByDrawer) {
            return ordersByDrawer[drawerID];
        }
        return [];
    };

    return {
        ticket: {
            select: toggleSelectedTicket,
            collapse: toggleCollapsedTicket,
            isCollapsed: (order: Order) => collapsedTickets.includes(order.order_id),
            isSelected: (order: Order) => selectedTickets.includes(order.order_id),
            all: {
                select: toggleSelectAllTickets,
                collapse: toggleCollapseAllTickets,
                areCollapsed: allCollapsed,
                areSelected: allSelected,
                count: orderCount,
            },
            none: {
                areCollapsed: noneCollapsed,
                areSelected: noneSelected,
            },
            count: {
                selected: selectedTickets.length,
                collapsed: collapsedTickets.length,
            },
        },
        drawer: {
            onClick: handleDrawerClick,
            removeOrders: removeTicketsFromDrawer,
            current: openDrawer,
            unassigned: unassignedDrawer,
            isUnassignedDrawer: openDrawer?.drawer_id === 'unassigned',
        },
        orders: {
            forCurrentDrawer: orders,
            all: allOrders,
            byDrawerID: getOrdersByDrawerID,
        },
    };
};
