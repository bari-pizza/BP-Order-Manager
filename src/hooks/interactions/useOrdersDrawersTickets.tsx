import { useRef, useState, RefObject } from 'react';
import type { Drawer, DriverDrawer, Order } from '../../typesAndValidators';
import { addOrdersToDrawer, getAllDaysOrders, removeOrdersFromDrawer } from '../../supabaseQueries';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useBusinessDate } from '../data/useBusinessDate';
import { dayjsToMDY } from '../../utils';
import { addOrdersToast, removeOrdersToast } from '../../helpers/toast';
import { toast } from 'react-toastify';

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
    const [handlingDrawerClick, setHandlingDrawerClick] = useState(false);
    const toastRef = useRef<{ [orderID: string]: { resolve: Resolve<unknown>; reject: Reject } }>({});

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

            const drawerWidth = (drawer.computedStyleMap().get('width') as CSSUnitValue).value;
            // TODO: maybe make a copy of ticket so that even if the ticket is no longer visible, it can still be animated
            const pizzaImg = ticket.nextSibling as HTMLImageElement;
            const scale = drawerRect.height / ticketRect.height / 2;
            const scalePizza = drawerWidth / pizzaImg.width / 2;

            const ticketCenterX = ticketRect.left + ticketRect.width / 2;
            const ticketCenterY = ticketRect.top + ticketRect.height / 2;

            const drawerCenterX = drawerRect.left + drawerRect.width / 2;
            const drawerCenterY = drawerRect.top + drawerRect.height / 2;

            // Set the ticket to fixed position to allow it to move freely
            ticket.style.position = 'fixed';
            ticket.style.top = `${ticketRect.top}px`;
            ticket.style.left = `${ticketRect.left}px`;

            // pizzaImg.style.position = 'fixed';
            pizzaImg.style.top = `${ticketRect.top}px`;
            pizzaImg.style.left = `${ticketRect.left}px`;

            // each ticket is 45 degrees
            const angle = ((45 * Math.PI) / 180) * index;

            const deltaX = drawerCenterX - ticketCenterX + (Math.sin(angle) * drawerRect.width) / 4;
            const deltaY = drawerCenterY - ticketCenterY - (Math.cos(angle) * drawerRect.height) / 4;

            const delay = index * 100;

            // Trigger the animation
            ticket.style.transition = 'all .75s ease-in-out';
            ticket.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scale(${scale})
            rotate(${angle}rad)
            `;
            ticket.style.opacity = '0';

            pizzaImg.style.transition = 'all .75s ease-in-out';
            pizzaImg.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scale(${scalePizza})
            rotate(${angle}rad)
            `;
            pizzaImg.style.opacity = '1';

            ticket.style.transitionDelay = `${delay}ms`;
            pizzaImg.style.transitionDelay = `${delay}ms`;

            setTimeout(async () => {
                // // Reset the icon's position
                ticket.style.display = 'none';
                ticket.style.position = 'static';
                ticket.style.transform = `translate(0, 0)`;
                ticket.style.transition = 'none';
                pizzaImg.style.transition = 'opacity .25s ease-in-out';
                pizzaImg.style.opacity = '0';
                resolve();
            }, 1000 + delay); // Adjust to match your transition duration
        });
    };

    const queryClient = useQueryClient();

    const handleAnimations = (orderIDs: string[], drawerID: string) => {
        let index = -1;
        const animations = orderIDs.map((id) => {
            const ticketRef = ticketRefs.current[id];
            const drawerRef = drawerRefs.current[drawerID];
            index++;
            return animateTicketToDrawer(ticketRef, drawerRef, index);
        });

        Promise.all(animations).then(() => {
            setSelectedTickets([]);
            queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
            setHandlingDrawerClick(false);
        });
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
            errors: { message: string; order_id: string }[];
            drawer_id: string;
        }) => {
            const { resolve, reject } = toastRef.current['add'];
            if (updatedOrderIDs.length) {
                resolve({
                    payload: { orderIDs: updatedOrderIDs },
                });
            }
            if (errors.length) {
                reject({ errors });
                errors.forEach(({ order_id }) => {
                    const order = allOrders.find((order) => order.order_id === order_id);
                    const orderTitle = order?.order_name ?? `Order ${order?.order_number}`;
                    toast.error(`Error adding ${orderTitle} to drawer`, {
                        autoClose: 3000,
                    });
                });
                // errors.forEach here
            }
            handleAnimations(updatedOrderIDs, drawerID);
        },
        onError: (error) => {
            console.error(`Issue updating order(s): "${error}"`, error);
        },
    });

    const unassignOrdersFromDrawerMutation = useMutation({
        mutationFn: ({ drawerID, orderIDs }: { drawerID: string; orderIDs: string[] }) =>
            removeOrdersFromDrawer({ drawerID, orderIDs }),
        onSuccess: (orderIDs) => {
            console.log({ orderIDs });
            // should be ids of orders that were successfully updated
            const { resolve } = toastRef.current['remove'];
            resolve({ payload: { orderIDs } });
            // if I want to add error handling, I need to add errors to the supabase response
            handleAnimations(orderIDs, 'unassigned');
        },
        onError: (error) => {
            console.error(`Issue updating order(s): "${error}"`, error);
        },
    });

    // const handleToastCreation = (orderIDs: string[], drawer: Drawer | DriverDrawer, isAdding = true) => {
    //     if (orderIDs.length > 0) {
    //         // const id = toast.loading(
    //         //     `${isAdding ? 'Added' : 'Removed'} ${orderIDs.length} ticket${orderIDs.length > 1 ? 's' : ''} ${isAdding ? 'to' : 'from'} ${drawer.name}`,
    //         //     {
    //         //         type: 'info',
    //         //     },
    //         // );
    //         // toastRef.current[`${isAdding ? 'add' : 'remove'}`] = id;
    //     }
    // };

    const putTicketsInDrawer = (drawer: Drawer | DriverDrawer) => {
        const drawerID = drawer.drawer_id;
        const { resolve, reject } = addOrdersToast(selectedTickets, drawer);
        toastRef.current['add'] = { resolve, reject };
        assignOrdersToDrawerMutation.mutate({ drawerID, orderIDs: selectedTickets });
    };

    const removeTicketsFromDrawer = () => {
        const drawerID = openDrawer.drawer_id;
        const { resolve, reject } = removeOrdersToast(selectedTickets, openDrawer);
        toastRef.current['remove'] = { resolve, reject };
        unassignOrdersFromDrawerMutation.mutate({ drawerID, orderIDs: selectedTickets });
    };

    const handleDrawerClick = (drawer: Drawer | DriverDrawer) => {
        if (handlingDrawerClick) {
            toggleDrawerOpen(drawer);
            return;
        }
        setHandlingDrawerClick(true);
        if (selectedTickets.length > 0) {
            if (drawer.drawer_id === openDrawer.drawer_id) {
                setSelectedTickets([]);
                setHandlingDrawerClick(false);
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
