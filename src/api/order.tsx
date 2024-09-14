import dayjs from 'dayjs';
import { supaClient } from '../supaClient';
import { NewOrder, Order, Order_Payment } from '../typesAndValidators';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { useSuspenseQuery } from '@tanstack/react-query';

/*

export const addOrdersToDrawer = async ({ orderIDs, drawerID }: { orderIDs: string[]; drawerID: string }) => {
    const { data, error } = await supaClient.rpc('add_orders_to_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });
    if (error) {
        console.error(error);
        throw error;
    } else {
        return data;
    }
    // return handleResponse<Order>({ data, error, shouldThrow: true });
};

export const removeOrdersFromDrawer = async ({ orderIDs, drawerID }: { orderIDs: string[]; drawerID: string }) => {
    const { data, error } = await supaClient.rpc('remove_orders_from_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });
    console.log({ data });
    if (error) {
        console.error(error);
        throw error;
    } else {
        return data;
    }
    // can use handleResponse once we update the return type from db
    // return handleResponse<Order_Payment>({ data, error, shouldThrow: true });
};
*/

const getAllDaysOrders = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const payload = await supaClient
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

    return handlePayload<Order_Payment>(payload);
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
    console.log({ payload });
    return handlePayload<Order>(payload);
};

const addOrdersToDrawer: SupabaseInteractor<{ orderIDs: string[]; drawerID: string }, Order> = async ({
    orderIDs,
    drawerID,
}) => {
    const payload = await supaClient.rpc('add_orders_to_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });

    console.log({ payload });
    return handlePayload<Order>(payload);

    // return handleResponse<Order>({ data, error, shouldThrow: true });
};

const useGetAllDaysOrders = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    return useSuspenseQuery({
        queryKey: [businessDate.format('YYYY-MM-DD')],
        queryFn: () => getAllDaysOrders({ businessDate }),
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
        forEachError: (error) => {
            console.log(error);
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
        forEachError: (error) => {
            console.log(error);
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
        forEachError: (error) => {
            console.log(error);
        },
    });
};

const useAddOrdersToDrawer = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<{ orderIDs: string[]; drawerID: string }, Order>({
        interactor: addOrdersToDrawer,
        queryKey,
        getMessages: {
            pending: () => 'Adding orders to drawer...',
            success: () => `Successfully added orders to drawer`,
            mainError: (error) => error.message,
            errors: () => `Failed to add orders to drawer`,
        },
        forEachError: (order) => {
            console.error({ order });
        },
    });
};

export const useOrderCRUD = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const queryKey = [businessDate.format('YYYY-MM-DD')];
    return {
        orderMutations: {
            getAll: useGetAllDaysOrders({ businessDate }),
            create: useCreateNewOrder({ queryKey }).mutate,
            update: useUpdateOrder({ queryKey }).mutate,
            delete: useDeleteOrder({ queryKey }).mutate,
            addOrdersToDrawer: useAddOrdersToDrawer({ queryKey }).mutate,
        },
    };
};
