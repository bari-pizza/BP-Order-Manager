import { useRef, useState, RefObject } from 'react';
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
    const ticketRefs = useRef<{ [key: string]: RefObject<SVGSVGElement> }>({});
    const drawerRefs = useRef<{ [key: string]: RefObject<HTMLDivElement> }>({});
    const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer>(unassignedDrawer);
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

    const animateTicketToDrawer = (
        ticketRef: RefObject<SVGSVGElement>,
        drawerRef: RefObject<HTMLDivElement>,
        index: number = 0,
    ): Promise<void> => {
        return new Promise((resolve) => {
            const ticket = ticketRef.current;
            const drawer = drawerRef.current;

            if (!ticket || !drawer) {
                resolve();
                return;
            }

            // Calculate the position differences
            const ticketRect = ticket.getBoundingClientRect();
            const drawerRect = drawer.getBoundingClientRect();

            console.log({
                ticketRect,
                drawerRect,
            });

            const scale = drawerRect.height / ticketRect.height / 2;

            const ticketCenterX = ticketRect.left + ticketRect.width / 2;
            const ticketCenterY = ticketRect.top + ticketRect.height / 2;

            const drawerCenterX = drawerRect.left + drawerRect.width / 2;
            const drawerCenterY = drawerRect.top + drawerRect.height / 2;

            // Set the ticket to fixed position to allow it to move freely
            ticket.style.position = 'fixed';
            ticket.style.top = `${ticketRect.top}px`;
            ticket.style.left = `${ticketRect.left}px`;

            // each ticket is 45 degrees
            const angle = ((45 * Math.PI) / 180) * index;

            const deltaX = drawerCenterX - ticketCenterX + (Math.sin(angle) * drawerRect.width) / 4;
            const deltaY = drawerCenterY - ticketCenterY - (Math.cos(angle) * drawerRect.height) / 4;

            const delay = index * 50;

            // Trigger the animation
            ticket.style.transition = 'transform .4s ease-in-out';
            ticket.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scale(${scale})
            rotate(${angle}rad)
            `;
            ticket.style.transitionDelay = `${delay}ms`;

            setTimeout(async () => {
                // // Reset the icon's position
                ticket.style.display = 'none';
                ticket.style.position = 'static';
                ticket.style.transform = `translate(0, 0)`;
                ticket.style.transition = 'none';
                resolve();
            }, 750 + delay); // Adjust to match your transition duration
        });
    };

    // TODO: maybe animate the whole card moving instead of the icon
    // along with shrinking the card with CSSTransition

    const queryClient = useQueryClient();

    const invalidate = () => {
        console.log('invalidating orders');
        queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
    };

    const handleAnimations = (orderIDs: string[], drawerID: string) => {
        let index = -1;
        const animations = orderIDs.map((id) => {
            const ticketRef = ticketRefs.current[id];
            const drawerRef = drawerRefs.current[drawerID];
            index++;
            return animateTicketToDrawer(ticketRef, drawerRef, index);
        });

        // setSelectedTickets([]);
        Promise.all(animations).then(() => {
            setSelectedTickets([]);
            invalidate();
        });
        // .then(() => {
        //     setSelectedTickets([]);
        // });
    };

    const assignOrdersToDrawerMutation = useMutation({
        mutationFn: ({ drawerID, orderIDs }: { drawerID: string; orderIDs: string[] }) =>
            addOrdersToDrawer({ drawerID, orderIDs }),
        onSuccess: ({
            updated_order_ids: updatedOrderIDs,
            errors,
            drawer_id: drawerID,
        }: {
            updated_order_ids: string[];
            errors: string[];
            drawer_id: string;
        }) => {
            // should be ids of orders that were successfully updated
            // do something with errors here
            console.log({ updatedOrderIDs, errors });
            // queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
            handleAnimations(updatedOrderIDs, drawerID);
            // setSelectedTickets([]);
        },
        onError: (error) => {
            console.error(`Issue updating order(s): "${error}"`, error);
        },
    });

    const unassignOrdersFromDrawerMutation = useMutation({
        mutationFn: ({ drawerID, orderIDs }: { drawerID: string; orderIDs: string[] }) =>
            removeOrdersFromDrawer({ drawerID, orderIDs }),
        onSuccess: (orderIDs: string[]) => {
            console.log({ orderIDs });
            // should be ids of orders that were successfully updated
            handleAnimations(orderIDs, 'unassigned');
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
                return;
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
            refs: ticketRefs.current,
        },
        drawer: {
            onClick: handleDrawerClick,
            removeOrders: removeTicketsFromDrawer,
            current: openDrawer,
            unassigned: unassignedDrawer,
            isUnassignedDrawer: openDrawer?.drawer_id === 'unassigned',
            refs: drawerRefs.current,
        },
        orders: {
            forCurrentDrawer: orders,
            all: allOrders,
            byDrawerID: getOrdersByDrawerID,
        },
    };
};
