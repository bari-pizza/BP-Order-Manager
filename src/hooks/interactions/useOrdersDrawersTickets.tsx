import { useRef, useState, RefObject } from 'react';
import type { Drawer, DriverDrawer, Order } from '../../typesAndValidators';
import { addOrdersToDrawer, getAllDaysOrders, removeOrdersFromDrawer } from '../../supabaseQueries';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useBusinessDate } from '../data/useBusinessDate';
import { dayjsToMDY } from '../../utils';
import { addOrdersToast, HandleOutcomeProps, removeOrdersToast } from '../../helpers/toast';
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
    const toastRef = useRef<{
        [orderID: string]: ({ data, errors, forEachError }: HandleOutcomeProps) => void;
    }>({});

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

    // TODO: when all tickets have errors, they're not visible because the page immediately refreshes

    const animateTicketToDrawer = (
        ticketRef: RefObject<SVGSVGElement>,
        drawerRef: RefObject<HTMLDivElement>,
        index: number = 0,
    ): Promise<void> => {
        return new Promise((resolve) => {
            const originalTicket = ticketRef.current;
            if (!originalTicket || !drawerRef.current) {
                resolve();
                return;
            }

            const drawer = drawerRef.current;
            const card = originalTicket.closest('.MuiPaper-root') as HTMLDivElement;
            card.classList.add('ticket-animating');
            // make a copy so that the animation can finish even if the original ticket is removed
            const ticket = originalTicket.cloneNode() as SVGSVGElement;
            const pizzaImg = originalTicket.nextSibling?.cloneNode() as HTMLImageElement;
            const root = document.querySelector('#root') as HTMLBodyElement;
            root.append(ticket);
            root.append(pizzaImg);
            // document.body.appendChild(ticket); bad idea
            // document.body.appendChild(pizzaImg); bad idea

            // Calculate the position differences
            const ticketRect = originalTicket.getBoundingClientRect();
            const drawerRect = drawer.getBoundingClientRect();

            const drawerWidth = (drawer.computedStyleMap().get('width') as CSSUnitValue).value;
            // const drawerWidth = drawerRect.width;
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

            pizzaImg.style.position = 'fixed';
            pizzaImg.style.top = `${ticketRect.top}px`;
            pizzaImg.style.left = `${ticketRect.left}px`;

            // each ticket is 45 degrees
            const angle = ((45 * Math.PI) / 180) * index;

            const deltaX = drawerCenterX - ticketCenterX + (Math.sin(angle) * drawerRect.width) / 4;
            const deltaY = drawerCenterY - ticketCenterY - (Math.cos(angle) * drawerRect.height) / 4;

            const delay = index * 100;

            // Trigger the animation
            ticket.style.transition = 'all .6s ease-in-out';
            ticket.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scale(${scale})
            rotate(${angle}rad)
            `;
            ticket.style.opacity = '0';
            originalTicket.style.opacity = '0';

            pizzaImg.style.transition = 'transform .6s ease-in-out';
            pizzaImg.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scale(${scalePizza})
            rotate(${angle}rad)
            `;
            pizzaImg.style.opacity = '1';

            ticket.style.transitionDelay = `${delay}ms`;
            pizzaImg.style.transitionDelay = `${delay}ms`;

            setTimeout(async () => {
                // Put everything back the way it was
                // both were copies so we have to remove them

                ticket.style.display = 'none';
                ticket.style.transition = 'none';
                ticket.remove();

                pizzaImg.style.opacity = '0';
                pizzaImg.style.transition = 'opacity .25s ease-in-out';
                pizzaImg.remove();

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

        // THIS DUMMY PROMISE MAKES SURE THAT ERROR ANIMATIONS STILL RUN BEFORE TICKETS ARE UNSELECTED
        if (animations.length === 0) {
            new Promise<void>((resolve) =>
                setTimeout(() => {
                    setHandlingDrawerClick(false);
                    resolve();
                }, 2000),
            );
            return;
        }

        Promise.all(animations)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });
            })
            .then(() => {
                setTimeout(() => {
                    setSelectedTickets([]);
                    setHandlingDrawerClick(false);
                }, 1000);
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
            // TODO: would be nice if we got the drawer name here
        }) => {
            const handleOutcome = toastRef.current['add'];
            handleOutcome({
                data: updatedOrderIDs.length ? { payload: { orderIDs: updatedOrderIDs } } : null,
                errors,
                forEachError: ({ order_id }) => {
                    const order = allOrders.find((order) => order.order_id === order_id);
                    if (!order) {
                        return;
                    }
                    const orderTitle = order?.order_name ?? `Order ${order?.order_number}`;
                    const body = `Error adding ${orderTitle} to drawer`;
                    const ticketRef = ticketRefs.current[order?.order_id];
                    const cardWithError = ticketRef?.current?.closest('.MuiPaper-root') as HTMLElement;
                    cardWithError.classList.add('toast-error');
                    const autoClose = 1500;
                    setTimeout(() => {
                        cardWithError.classList.remove('toast-error');
                    }, autoClose);

                    toast.error(body, { autoClose });
                },
            });
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
            const handleOutcome = toastRef.current['remove'];
            handleOutcome({ data: orderIDs.length ? { payload: { orderIDs } } : null });
            handleAnimations(orderIDs, 'unassigned');
        },
        onError: (error) => {
            console.error(`Issue updating order(s): "${error}"`, error);
        },
    });

    const putTicketsInDrawer = (drawer: Drawer | DriverDrawer) => {
        const drawerID = drawer.drawer_id;
        toastRef.current['add'] = addOrdersToast(selectedTickets, drawer);
        assignOrdersToDrawerMutation.mutate({ drawerID, orderIDs: selectedTickets });
    };

    const removeTicketsFromDrawer = () => {
        const drawerID = openDrawer.drawer_id;
        toastRef.current['remove'] = removeOrdersToast(selectedTickets, openDrawer);
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
