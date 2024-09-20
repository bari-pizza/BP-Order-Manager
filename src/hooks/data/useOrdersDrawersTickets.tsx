import { useRef, useState, RefObject } from 'react';
import type { Drawer, Driver_Drawer, Order_Payment } from '../../typesAndValidators';
import { useBusinessDate } from '../data/useBusinessDate';
import { useLocalStorage } from './useLocalStorage';
import { useBusinessDayDrawerAPI } from '../../api/businessDayDrawer';
import { useOrderAPI } from '../../api/order';
import { RPCPayload } from '../../api/helpers';
import useSubscribeToTable from './useSubscribeToTable';

const unassignedDrawer: Drawer = {
    drawer_id: 'unassigned',
    name: 'Unassigned',
    created_at: '2024-08-27T00:00:00.000Z',
    drawer_type: 'unassigned',
};

export const useOrdersDrawersTickets = () => {
    const [businessDate] = useBusinessDate();
    const { orderAPI } = useOrderAPI({ businessDate });
    // const subscription = orderAPI.subscribe();
    // console.log({ subscription });
    const { data: initialData } = orderAPI.getAll;
    const allOrders = useSubscribeToTable<Order_Payment>({ tableName: 'Order', initialData });
    console.log({ allOrders });
    // const { data: allOrders } = orderAPI.getAll;
    const { businessDayDrawerAPI } = useBusinessDayDrawerAPI({
        businessDate,
    });
    const { data: summaries } = businessDayDrawerAPI.getAll;

    const allPayments = allOrders.flatMap((order) => order.payments);
    const ticketRefs = useRef<{ [key: string]: RefObject<SVGSVGElement> }>({});
    const drawerRefs = useRef<{ [key: string]: RefObject<HTMLDivElement> }>({});

    const { value: openDrawer, setValue: setOpenDrawer } = useLocalStorage<'openDrawer'>(
        'openDrawer',
        unassignedDrawer,
    );
    const orders = allOrders?.filter(
        (order) => order.drawer_id === (openDrawer.drawer_id === 'unassigned' ? null : openDrawer.drawer_id),
    );
    const ordersByDrawer = allOrders?.reduce((acc: { [key: string]: Order_Payment[] }, order) => {
        const key = order.drawer_id ?? 'unassigned';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(order);
        return acc;
    }, {});
    const [collapsedTickets, setCollapsedTickets] = useState<string[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [handlingDrawerClick, setHandlingDrawerClick] = useState(false);

    const orderCount = orders?.length ?? 0;

    const allCollapsed = collapsedTickets.length === orderCount;
    const allSelected = selectedTickets.length === orderCount;

    const noneCollapsed = collapsedTickets.length === 0;
    const noneSelected = selectedTickets.length === 0;

    const toggleCollapsedTicket = (order: Order_Payment) => {
        setCollapsedTickets((prev) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((id) => id !== order.order_id);
            }
            return [...prev, order.order_id];
        });
    };

    const toggleSelectedTicket = (order: Order_Payment) => {
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
        if (noneSelected) {
            setSelectedTickets(orders?.map((order) => order.order_id) || []);
        } else {
            setSelectedTickets([]);
        }
    };

    const toggleDrawerOpen = (drawer: Drawer | Driver_Drawer) => {
        if (openDrawer.drawer_id === drawer.drawer_id) {
            setOpenDrawer(unassignedDrawer);
        } else {
            setOpenDrawer(drawer);
        }
    };

    const putTicketsInDrawer = (drawer: Drawer | Driver_Drawer) => {
        const drawerID = drawer.drawer_id;
        const handleSuccess = (response: RPCPayload['data']) => {
            const unsuccessfulOrderIDs = response?.failures.flatMap((failure) => Object.keys(failure)) || [];
            console.log({ response, unsuccessfulOrderIDs });
            setSelectedTickets(unsuccessfulOrderIDs);
            setHandlingDrawerClick(false);
        };
        const handleFailure = () => {
            setHandlingDrawerClick(false);
        };
        orderAPI.addOrdersToDrawer({ drawerID, orderIDs: selectedTickets, handleSuccess, handleFailure });
    };

    const removeTicketsFromDrawer = () => {
        const drawerID = openDrawer.drawer_id;
        const handleSuccess = (response: RPCPayload['data']) => {
            const unsuccessfulOrderIDs = Object.keys(response!.failures);
            setSelectedTickets(unsuccessfulOrderIDs);
            setHandlingDrawerClick(false);
        };
        const handleFailure = () => {
            setHandlingDrawerClick(false);
        };
        orderAPI.removeOrdersFromDrawer({ drawerID, orderIDs: selectedTickets, handleSuccess, handleFailure });
    };

    const handleDrawerClick = (drawer: Drawer | Driver_Drawer) => {
        if (handlingDrawerClick) {
            return;
        }
        /* 
            paths: 
                click on own drawer 
                    1. with selected tickets
                        set openDrawer to unassigned
                        set selected tickets to []
                    2. without 
                        set openDrawer to unassigned
                
                click on UNASSIGNED drawer
                    3. with selected tickets
                        attempt to remove tickets from drawer
                            a) complete success
                                set selected tickets to []
                                invalidate query
                            b) partial success
                                set selected tickets to [...unsuccessful tickets]
                                invalidate query
                            c) error
                                nothing
                    4. without
                        set openDrawer to unassigned

                click on other drawer
                    5. with selected tickets
                        attempt to put tickets in drawer
                            a) complete success
                                set selected tickets to []
                                invalidate query
                            b) partial success
                                set selected tickets to [...unsuccessful tickets]
                                invalidate query
                            c) error
                                nothing
                    6. without
                        set openDrawer to drawer

                    
        */
        setHandlingDrawerClick(true);
        if (selectedTickets.length > 0) {
            if (drawer.drawer_id === openDrawer.drawer_id) {
                // path 1
                setSelectedTickets([]);
                toggleDrawerOpen(drawer);
                setHandlingDrawerClick(false);
                return;
            } else if (drawer.drawer_id === 'unassigned') {
                // path 3
                removeTicketsFromDrawer();
                return;
            } else {
                // path 5
                putTicketsInDrawer(drawer);
                return;
            }
        }
        // path 2, 4, and 6
        toggleDrawerOpen(drawer);
        setHandlingDrawerClick(false);
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

    // TODO: *** look into subscribing to orders ***

    const closeBusinessDayDrawer = (drawer: Drawer | Driver_Drawer) => {
        businessDayDrawerAPI.close({ drawerID: drawer.drawer_id });
    };

    const reOpenBusinessDayDrawer = (drawer: Drawer | Driver_Drawer) => {
        businessDayDrawerAPI.reOpen({ drawerID: drawer.drawer_id });
    };

    const getSummaryByDrawerID = (drawerID?: string) => {
        if (!drawerID) {
            return null;
        }
        const summary = summaries.find(({ drawer_id }) => drawer_id === drawerID) || null;
        return summary;
    };

    return {
        ticket: {
            select: toggleSelectedTicket,
            collapse: toggleCollapsedTicket,
            isCollapsed: (order: Order_Payment) => collapsedTickets.includes(order.order_id),
            isSelected: (order: Order_Payment) => selectedTickets.includes(order.order_id),
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
            refs: ticketRefs.current,
        },
        drawer: {
            onClick: handleDrawerClick,
            removeOrders: removeTicketsFromDrawer,
            current: openDrawer,
            unassigned: unassignedDrawer,
            isUnassignedDrawer: openDrawer?.drawer_id === 'unassigned',
            refs: drawerRefs.current,
            close: closeBusinessDayDrawer,
            reOpen: reOpenBusinessDayDrawer,
        },
        orders: {
            forCurrentDrawer: orders,
            all: allOrders,
            byDrawerID: getOrdersByDrawerID,
        },
        payments: {
            all: allPayments,
            // only useful for admin / manager pages
        },
        summaries: {
            all: summaries,
            forCurrentDrawer: getSummaryByDrawerID(openDrawer?.drawer_id),
            byDrawerID: (drawerID: string) => getSummaryByDrawerID(drawerID),
            update: businessDayDrawerAPI.upsert,
        },
    };
};
