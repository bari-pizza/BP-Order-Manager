import dayjs from 'dayjs';
import { supaClient } from '../supaClient';
import { NewOrder, Order, Order_Payment } from '../typesAndValidators';
import {
    handlePayload,
    // handleRPCPayload,
    Payload,
    RPCPayload,
    SupabaseInteractor,
    SupabaseRPCInteractor,
    useInteractionHandler,
    useRPCInteractionHandler,
} from './helpers';
// import { useSuspenseQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { removeOrdersFromDrawer } from '../supabaseQueries';

// const useSubscribeToChanges = <T,>({ fetchInitialData, subscriptions }: { fetchInitialData: () => Promise<T[]> }) => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         // Fetch initial data using the provided function
//         const fetchData = async () => {
//             const initialData = await fetchInitialData();
//             setData(initialData);
//         };

//         fetchData();

//         const orderSubscription = supaClient
//             .channel('custom-all-channel')
//             .on('postgres_changes', { event: '*', schema: 'public', table: 'Order' }, (payload) => {
//                 // debug removed
//             })
//             .subscribe();

//         const paymentSubscription = supaClient
//             .channel('custom-all-channel')
//             .on('postgres_changes', { event: '*', schema: 'public', table: 'Payment' }, (payload) => {
//                 // debug removed
//             })
//             .subscribe();

//         // Cleanup subscriptions on component unmount
//         return () => {
//             supaClient.removeSubscription(orderSubscription);
//             supaClient.removeSubscription(paymentSubscription);
//         };
//     }, [businessDate, fetchInitialData]);

//     return data;
// };

const subscribeToOrders = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const channel = supaClient
        .channel('changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'Order',
                filter: `business_date=eq.${businessDate.format('YYYY-MM-DD')}`,
            },
            () => {}, // Subscription callback
        )
        .subscribe();
    return channel;
};

// const getAllDaysOrders = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     const formattedDate = businessDate.format('YYYY-MM-DD');
//     const { data, error } = await supaClient
//         .from('Order')
//         .select(
//             `
//         *,
//         payments:Payment (
//           *
//         )
//       `,
//         )
//         .eq('business_date', formattedDate)
//         .order('order_number', { ascending: true });

//     if (error) {
//         // debug removed
//         return [];
//     }
//     if (!data || data.length === 0) return [];

//     return data as unknown as Order_Payment[];
// };

// const useSubscribeToAllDaysOrders = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     const tableName = 'Order';
//     const initialQueryFn = () => getAllDaysOrders({ businessDate });
//     return useSubscribeToTable({ tableName, initialQueryFn });
// };

const createNewOrder: SupabaseInteractor<NewOrder, Order> = async (newOrder) => {
    const payload = (await supaClient.from('Order').insert([newOrder]).select('*')) as Payload<Order>;
    return handlePayload<Order>(payload);
};

const updateOrder: SupabaseInteractor<Order_Payment, Order> = async (order) => {
    const payload = (await supaClient
        .from('Order')
        .update(order)
        .eq('order_id', order.order_id)
        .select('*')) as Payload<Order>;
    return handlePayload<Order>(payload);
};

const deleteOrder: SupabaseInteractor<string, Order> = async (orderID) => {
    const payload = await supaClient.from('Order').delete().eq('order_id', orderID).select();
    return handlePayload<Order>(payload);
};

// const deleteOrder: SupabaseRPCInteractor<{ orderID: string }> = async ({ orderID }) => {
//     // call supaClient.rpc('delete_order', { p_order_id: [orderID] });
//     // if payments exist, return error
//     // if drawerID exists, remove from drawer, return error if drawer is locked
//     // delete order
//     const { data } = await supaClient.rpc('delete_order', {
//         p_order_id: orderID,
//     });

//     return data as unknown as RPCPayload;
// };

const addOrdersToDrawer: SupabaseRPCInteractor<{ orderIDs: string[]; drawerID: string }> = async ({
    orderIDs,
    drawerID,
}) => {
    const { data } = await supaClient.rpc('add_orders_to_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });

    return data as unknown as RPCPayload;
};

// const useGetAllDaysOrders = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     return useSuspenseQuery({
//         queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
//         queryFn: () => getAllDaysOrders({ businessDate }),
//         refetchOnWindowFocus: false,
//         staleTime: 1000 * 60 * 30,
//     });
// };

const useCreateNewOrder = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewOrder, Order>({
        interactor: createNewOrder,
        queryKey,
        getMessages: {
            pending: () => 'Creating new order...',
            success: () => `Successfully created new order.`,
            mainError: (error) => error!.message,
            errors: () => `Failed to create new order.`,
        },
    });
};

const useUpdateOrder = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<Order_Payment, Order>({
        interactor: updateOrder,
        queryKey,
        getMessages: {
            pending: () => 'Updating order...',
            success: () => `Successfully updated order`,
            mainError: (error) => error!.message,
            errors: () => `Failed to update order`,
        },
    });
};

const useDeleteOrder = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<string, Order>({
        interactor: deleteOrder,
        queryKey,
        getMessages: {
            pending: () => 'Deleting order...',
            success: () => `Successfully deleted order`,
            mainError: (error) => error!.message,
            errors: () => `Failed to delete order`,
        },
    });
};

// const useDeleteOrder = ({ queryKey }: { queryKey: string[] }) => {
//     return useRPCInteractionHandler<{ orderID: string }>({
//         interactor: deleteOrder,
//         queryKey,
//         getMessages: {
//             pending: () => 'Deleting order...',
//             success: () => `Successfully deleted order`,
//             mainError: () => `Failed to delete order`,
//             errors: (error) => error!.message,
//         },
//         forEachError: (error) => {
//             // debug removed
//         },
//     });
// };

const useAddOrdersToDrawer = ({
    queryKey,
    handleSuccessRef,
    handleFailureRef,
}: {
    queryKey: string[];
    handleSuccessRef: React.MutableRefObject<{
        [key: string]: (response: RPCPayload['data']) => void;
    }>;
    handleFailureRef: React.MutableRefObject<{
        [key: string]: (error: PostgrestError | Error) => void;
    }>;
}) => {
    return useRPCInteractionHandler<{ orderIDs: string[]; drawerID: string }>({
        interactor: addOrdersToDrawer,
        queryKey,
        getMessages: {
            pending: () => 'Adding orders to drawer...',
            success: () => `Successfully added order(s) to drawer`,
            mainError: () => `Failed to add order(s) to drawer`,
            errors: (error) => error!.message,
        },
        forEachError: (error) => {
            // toast.error(error);
        },
        handleSuccess(response) {
            const handleSuccess = handleSuccessRef.current['addOrdersToDrawer'];
            if (handleSuccess) {
                handleSuccess(response);
            }
        },
        handleFailure(error) {
            const handleFailure = handleFailureRef.current['addOrdersToDrawer'];
            if (handleFailure) {
                handleFailure(error);
            }
        },
    });
};

const useRemoveOrdersFromDrawer = ({
    queryKey,
    handleSuccessRef,
    handleFailureRef,
}: {
    queryKey: string[];
    handleSuccessRef: React.MutableRefObject<{
        [key: string]: (response: RPCPayload['data']) => void;
    }>;
    handleFailureRef: React.MutableRefObject<{
        [key: string]: (error: PostgrestError | Error) => void;
    }>;
}) => {
    return useRPCInteractionHandler<{ orderIDs: string[]; drawerID: string }>({
        interactor: removeOrdersFromDrawer,
        queryKey,
        getMessages: {
            pending: () => 'Removing orders from drawer...',
            success: () => `Successfully removed order(s) from drawer`,
            mainError: () => `Failed to remove order(s) from drawer`,
            errors: (error) => error!.message,
        },
        forEachError: (order) => {
            // Error already handled by mutation
        },
        handleSuccess(response) {
            const handleSuccess = handleSuccessRef.current['removeOrdersFromDrawer'];
            if (handleSuccess) {
                handleSuccess(response);
            }
        },
        handleFailure(error) {
            const handleFailure = handleFailureRef.current['removeOrdersFromDrawer'];
            if (handleFailure) {
                handleFailure(error);
            }
        },
    });
};

export const useOrderAPI = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const handleSuccessRef = useRef<{
        [key: string]: (response: RPCPayload['data']) => void;
    }>({});

    const handleFailureRef = useRef<{
        [key: string]: (error: PostgrestError | Error) => void;
    }>({});
    const queryKey = ['orders', businessDate.format('YYYY-MM-DD')];
    const addOrdersToDrawerMutation = useAddOrdersToDrawer({
        queryKey,
        handleSuccessRef,
        handleFailureRef,
    });
    const removeOrdersFromDrawerMutation = useRemoveOrdersFromDrawer({
        queryKey,
        handleSuccessRef,
        handleFailureRef,
    });
    // const deleteOrderMutation = useDeleteOrder({
    //     queryKey,
    // });
    return {
        orderAPI: {
            subscribe: () => subscribeToOrders({ businessDate }),
            // getAll: useGetAllDaysOrders({ businessDate }),
            create: useCreateNewOrder({ queryKey }).mutate,
            update: useUpdateOrder({ queryKey }).mutate,
            delete: useDeleteOrder({ queryKey }).mutate,
            addOrdersToDrawer: ({
                orderIDs,
                drawerID,
                handleSuccess,
                handleFailure,
            }: {
                orderIDs: string[];
                drawerID: string;
                handleSuccess?: (response: RPCPayload['data']) => void;
                handleFailure?: (error: PostgrestError | Error) => void;
            }) => {
                if (handleSuccess) {
                    handleSuccessRef.current['addOrdersToDrawer'] = handleSuccess;
                }
                if (handleFailure) {
                    handleFailureRef.current['addOrdersToDrawer'] = handleFailure;
                }
                addOrdersToDrawerMutation.mutate({ orderIDs, drawerID });
            },
            // removeOrdersFromDrawer: useRemoveOrdersFromDrawer({ queryKey }).mutate,
            removeOrdersFromDrawer: ({
                orderIDs,
                drawerID,
                handleSuccess,
                handleFailure,
            }: {
                orderIDs: string[];
                drawerID: string;
                handleSuccess?: (response: RPCPayload['data']) => void;
                handleFailure?: (error: PostgrestError | Error) => void;
            }) => {
                if (handleSuccess) {
                    handleSuccessRef.current['removeOrdersFromDrawer'] = handleSuccess;
                }
                if (handleFailure) {
                    handleFailureRef.current['removeOrdersFromDrawer'] = handleFailure;
                }
                removeOrdersFromDrawerMutation.mutate({ orderIDs, drawerID });
            },
            // deleteOrder: ({
            //     orderID,
            //     handleSuccess,
            //     handleFailure,
            // }: {
            //     orderID: string;
            //     handleSuccess?: (response: RPCPayload['data']) => void;
            //     handleFailure?: (error: PostgrestError | Error) => void;
            // }) => {
            //     if (handleSuccess) {
            //         handleSuccessRef.current['removeOrdersFromDrawer'] = handleSuccess;
            //     }
            //     if (handleFailure) {
            //         handleFailureRef.current['removeOrdersFromDrawer'] = handleFailure;
            //     }
            //     deleteOrderMutation.mutate({ orderID });
            // },
        },
    };
};
