import { useRef, useState, RefObject } from 'react';
import {
    BusinessDayDrawerSummary,
    BusinessDaySummary,
    Order,
    Payment,
    type CashTransfer,
    type Drawer,
    type Driver_Drawer,
    type Order_Payment,
} from '../../typesAndValidators';
import { useBusinessDate } from '../data/useBusinessDate';
import { useLocalStorage } from './useLocalStorage';
import { useBusinessDayDrawerAPI } from '../../api/businessDayDrawer';
import { useOrderAPI } from '../../api/order';
import { RPCPayload } from '../../api/helpers';
import {} from // useSubscribeToTable,
// useSubscribeToPayments,
// useSubscribeToOrderPayments,
'./useSubscribeToTable';
import { useCashTransferAPI } from '../../api/cashTransfer';
import { useBusinessDaySummaryAPI } from '../../api/businessDateSummary';
import { useDocumentTitle } from 'usehooks-ts';
import { useQueryClient } from '@tanstack/react-query';
import { sortOrders } from '../../utils';
import { toast } from 'react-toastify';
import { PostgrestError } from '@supabase/supabase-js';
// import { supaClient } from '../../supaClient';
// import dayjs from 'dayjs';

const unassignedDrawer: Drawer = {
    drawer_id: 'unassigned',
    name: 'Unassigned',
    created_at: '2024-08-27T00:00:00.000Z',
    drawer_type: 'unassigned',
    is_deleted: false,
};

// const getBusinessDaySummary = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     const { data, error } = await supaClient
//         .from('BusinessDaySummary')
//         .select('*')
//         .eq('business_date', businessDate.format('YYYY-MM-DD'));

//     if (error) {
//         console.error(error);
//         return [] as BusinessDaySummary[];
//     }
//     if (!data || data.length === 0) return [] as BusinessDaySummary[];

//     return [data[0] as unknown as BusinessDaySummary];
// };

// const getBusinessDayDrawerSummaries = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     const { data, error } = await supaClient
//         .from('BusinessDayDrawer')
//         .select('*')
//         .eq('business_date', businessDate.format('YYYY-MM-DD'));

//     if (error) {
//         console.error(error);
//         return [] as BusinessDayDrawerSummary[];
//     }
//     if (!data || data.length === 0) return [] as BusinessDayDrawerSummary[];

//     return data as unknown as BusinessDayDrawerSummary[];
// };

// const getCashTransfers = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     const { data, error } = await supaClient
//         .from('CashTransfer')
//         .select('*')
//         .eq('business_date', businessDate.format('YYYY-MM-DD'));

//     if (error) {
//         console.error(error);
//         return [] as CashTransfer[];
//     }

//     if (!data || data.length === 0) return [] as CashTransfer[];

//     return data as unknown as CashTransfer[];
// };

export const useOrdersDrawersTickets = () => {
    // COMPLETED useSubscribeToTable
    const [businessDate] = useBusinessDate();
    const { businessDaySummaryAPI } = useBusinessDaySummaryAPI({ businessDate }); // const { data: initialBusinessDaySummary } = businessDaySummaryAPI.getToday;
    // const businessDaySummary = useSubscribeToTable<BusinessDaySummary>({
    // useSubscribeToTable<BusinessDaySummary>({
    //     tableName: 'BusinessDaySummary',
    //     // initialData: initialBusinessDaySummary,
    //     primaryKeys: ['business_date'],
    //     queryKey: ['businessDaySummary', businessDate.format('YYYY-MM-DD')],
    //     queryFn: () => getBusinessDaySummary({ businessDate }),
    //     showToast: ['delete', 'insert', 'update'],
    //     isMobile,
    // });

    const queryClient = useQueryClient();

    const businessDaySummary = (queryClient.getQueryData(['businessDaySummaries', businessDate.format('YYYY-MM-DD')]) ??
        []) as BusinessDaySummary[];

    const businessDayIsLocked = businessDaySummary[0]?.is_locked || false;

    useDocumentTitle(`Order Manager [${businessDayIsLocked ? 'CLOSED' : 'OPEN'}]`);

    const { orderAPI } = useOrderAPI({ businessDate });
    // const queryClient = useQueryClient();
    const ordersWithoutPayments = (queryClient.getQueryData(['orders', businessDate.format('YYYY-MM-DD')]) ??
        []) as Order[];
    const payments = (queryClient.getQueryData(['payments', businessDate.format('YYYY-MM-DD')]) ?? []) as Payment[];
    const allOrderPayments: Order_Payment[] =
        ordersWithoutPayments.map((order) => ({
            ...order,
            payments: payments.filter((payment) => payment.order_id === order.order_id),
        })) || [];

    allOrderPayments.sort(sortOrders);

    const { businessDayDrawerAPI } = useBusinessDayDrawerAPI({
        businessDate,
    });
    // const { data: initialBusinessDayDrawerData } = businessDayDrawerAPI.getAll;
    // const summaries = useSubscribeToTable<BusinessDayDrawerSummary>({
    // useSubscribeToTable<BusinessDayDrawerSummary>({
    //     tableName: 'BusinessDayDrawer',
    //     // initialData: initialBusinessDayDrawerData,
    //     primaryKeys: ['drawer_id', 'business_date'],
    //     // queryKey: ['businessDayDrawers', businessDate.format('YYYY-MM-DD')],
    //     // showToast: ['delete', 'insert', 'update'],
    //     queryKey: ['businessDayDrawerSummary', businessDate.format('YYYY-MM-DD')],
    //     queryFn: () => getBusinessDayDrawerSummaries({ businessDate }),
    //     showToast: ['delete', 'insert', 'update'],
    //     isMobile,
    // });

    const summaries = (queryClient.getQueryData(['businessDayDrawerSummaries', businessDate.format('YYYY-MM-DD')]) ??
        []) as BusinessDayDrawerSummary[];

    const { cashTransferAPI } = useCashTransferAPI({ businessDate });
    // const { data: initialCashTransferData } = cashTransferAPI.getAll;
    // const cashTransfers = useSubscribeToTable<CashTransfer>({
    // useSubscribeToTable<CashTransfer>({
    //     tableName: 'CashTransfer',
    //     // initialData: initialCashTransferData,
    //     primaryKeys: ['cash_transfer_id'],
    //     queryKey: ['cashTransfers', businessDate.format('YYYY-MM-DD')],
    //     queryFn: () => getCashTransfers({ businessDate }),
    //     showToast: ['delete', 'insert', 'update'],
    //     isMobile,
    // });

    const cashTransfers = (queryClient.getQueryData(['cashTransfers', businessDate.format('YYYY-MM-DD')]) ??
        []) as CashTransfer[];

    const allPayments = allOrderPayments.flatMap((order) => order.payments);
    const ticketRefs = useRef<{ [key: string]: RefObject<SVGSVGElement> }>({});
    const drawerRefs = useRef<{ [key: string]: RefObject<HTMLDivElement> }>({});

    const { value: openDrawer, setValue: setOpenDrawer } = useLocalStorage<'openDrawer'>(
        'openDrawer',
        unassignedDrawer,
    );

    const orders = allOrderPayments?.filter(
        (order) => order.drawer_id === (openDrawer.drawer_id === 'unassigned' ? null : openDrawer.drawer_id),
    );

    const ordersByDrawer = allOrderPayments?.reduce((acc: { [key: string]: Order_Payment[] }, order) => {
        const key = order.drawer_id ?? 'unassigned';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(order);
        return acc;
    }, {});
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [handlingDrawerClick, setHandlingDrawerClick] = useState(false);

    const orderCount = orders?.length ?? 0;

    const allSelected = selectedTickets.length === orderCount;
    const noneSelected = selectedTickets.length === 0;

    const toggleSelectedTicket = (order: Order_Payment) => {
        setSelectedTickets((prev) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((id) => id !== order.order_id);
            }
            return [...prev, order.order_id];
        });
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

    const deleteOrderFromDB = (orderID: string) => {
        const handleSuccess = (response: RPCPayload['data']) => {
            console.log({ response });
            const successes = response!.successes;
            if (successes.length > 0) {
                toast.success('Order deleted successfully');
            }
        };
        const handleFailure = (error: PostgrestError | Error) => {
            console.error({ error });
            toast.error(error.message);
        };
        orderAPI.deleteOrder({ orderID, handleSuccess, handleFailure });
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

    const getCashTransferByDrawerID = (drawerID?: string) => {
        const byType: { bank: CashTransfer[]; payment: CashTransfer[]; other: CashTransfer[] } = {
            bank: [],
            payment: [],
            other: [],
        };
        if (!drawerID) {
            return byType;
        }
        cashTransfers.forEach((transfer) => {
            const { source, destination, transfer_type } = transfer;
            if (source !== drawerID && destination !== drawerID) {
                return;
            }
            byType[transfer_type].push(transfer);
        });
        return byType;
    };

    const orderDictionary = {
        orderNumbers: new Set(),
        orderNames: new Set(),
    };

    const repeats = {
        orderNumbers: new Set<number>(),
        orderNames: new Set<string>(),
    };

    allOrderPayments.forEach((order) => {
        if (order.order_number) {
            if (orderDictionary.orderNumbers.has(order.order_number)) {
                repeats.orderNumbers.add(order.order_number);
            } else {
                orderDictionary.orderNumbers.add(order.order_number);
            }
        } else if (order.order_name) {
            const orderName = order.order_name.trim().toLowerCase();
            if (orderDictionary.orderNames.has(orderName)) {
                repeats.orderNames.add(orderName);
            } else {
                orderDictionary.orderNames.add(orderName);
            }
        }
    });

    const isRepeat = (nameOrNumber: number | string | null, isStatic?: boolean) => {
        if (!nameOrNumber) {
            return false;
        }
        if (typeof nameOrNumber === 'number') {
            if (isStatic) {
                return repeats.orderNumbers.has(nameOrNumber);
            }
            return orderDictionary.orderNumbers.has(nameOrNumber);
        } else {
            const orderName = nameOrNumber.trim().toLowerCase();
            if (isStatic) {
                return repeats.orderNames.has(orderName);
            }
            return orderDictionary.orderNames.has(orderName);
        }
    };

    return {
        ticket: {
            select: toggleSelectedTicket,
            isSelected: (order: Order_Payment) => selectedTickets.includes(order.order_id),
            all: {
                select: toggleSelectAllTickets,
                areSelected: allSelected,
                count: orderCount,
            },
            none: {
                areSelected: noneSelected,
            },
            count: {
                selected: selectedTickets.length,
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
            all: allOrderPayments,
            byDrawerID: getOrdersByDrawerID,
            isRepeat,
            delete: deleteOrderFromDB,
        },
        payments: {
            all: allPayments,
            // only useful for admin / manager pages
        },
        summaries: {
            all: summaries,
            forCurrentDrawer: getSummaryByDrawerID(openDrawer?.drawer_id),
            byDrawerID: getSummaryByDrawerID,
            update: businessDayDrawerAPI.upsert,
        },
        cashTransfers: {
            all: cashTransfers,
            create: cashTransferAPI.create,
            delete: cashTransferAPI.delete,
            update: cashTransferAPI.update,
            forCurrentDrawer: getCashTransferByDrawerID(openDrawer?.drawer_id),
            byDrawerID: getCashTransferByDrawerID,
        },
        businessDay: {
            isLocked: businessDayIsLocked,
            reopen: businessDaySummaryAPI.open,
            close: businessDaySummaryAPI.close,
        },
    };
};
