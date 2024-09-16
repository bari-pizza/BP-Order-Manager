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
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { removeOrdersFromDrawer } from '../supabaseQueries';

const getAllDaysOrders = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const { data, error } = await supaClient
        .from('Order')
        .select(
            `
        *,
        payments:Payment (
          *
        )
      `,
        )
        .eq('business_date', businessDate)
        .order('order_number', { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }
    if (!data || data.length === 0) return [];

    return data as unknown as Order_Payment[];
};

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

const deleteOrder: SupabaseInteractor<Order_Payment, Order> = async (order) => {
    const payload = await supaClient.from('Order').delete().eq('order_id', order.order_id).select();
    return handlePayload<Order>(payload);
};

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

const useGetAllDaysOrders = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    return useSuspenseQuery({
        queryKey: ['orders', businessDate.format('YYYY-MM-DD')],
        queryFn: () => getAllDaysOrders({ businessDate }),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
};

const useCreateNewOrder = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewOrder, Order>({
        interactor: createNewOrder,
        queryKey,
        getMessages: {
            pending: () => 'Creating new order...',
            success: () => `Successfully created new order.`,
            mainError: (error) => error.message,
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
            mainError: (error) => error.message,
            errors: () => `Failed to update order`,
        },
    });
};

const useDeleteOrder = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<Order_Payment, Order>({
        interactor: deleteOrder,
        queryKey,
        getMessages: {
            pending: () => 'Deleting order...',
            success: () => `Successfully deleted order`,
            mainError: (error) => error.message,
            errors: () => `Failed to delete order`,
        },
    });
};

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
            errors: (error) => error.message,
        },
        forEachError: (error) => {
            console.error({ error }, 'forEachError');
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
            errors: (error) => error.message,
        },
        forEachError: (order) => {
            console.error({ order });
        },
        handleSuccess(response) {
            console.log({ response }, 'handleSuccess');
            const handleSuccess = handleSuccessRef.current['removeOrdersFromDrawer'];
            if (handleSuccess) {
                handleSuccess(response);
            }
        },
        handleFailure(error) {
            console.error({ error }, 'handleFailure');
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
    return {
        orderAPI: {
            getAll: useGetAllDaysOrders({ businessDate }),
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
        },
    };
};
