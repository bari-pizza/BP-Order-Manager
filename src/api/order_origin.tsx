import { supaClient } from '../supaClient';
import { handlePayload, Payload, StandardPayload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { OrderOrigin } from '../typesAndValidators';

type NewOrderOrigin = Omit<OrderOrigin, 'origin_id'>;

const createNewOrderOrigin: SupabaseInteractor<NewOrderOrigin, OrderOrigin> = async (newOrderOrigin) => {
    const payload = (await supaClient.from('OrderOrigin').insert([newOrderOrigin]).select('*')) as Payload<OrderOrigin>;
    return handlePayload<OrderOrigin>(payload);
};

const updateOrderOrigin: SupabaseInteractor<OrderOrigin, OrderOrigin> = async (orderOrigin) => {
    console.log('updating', orderOrigin);
    const payload = (await supaClient
        .from('OrderOrigin')
        .update([orderOrigin])
        .eq('origin_id', orderOrigin.origin_id)
        .select('*')) as Payload<OrderOrigin>;
    return handlePayload<OrderOrigin>(payload);
};

const useCreateNewOrderOrigin = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewOrderOrigin, OrderOrigin>({
        interactor: createNewOrderOrigin,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving new order origin...',
            success: (data) => `Successfully saved new order origin: ${data.name}`,
            mainError: (error) => error.message,
            errors: (data) => `Failed to create new order origin: ${data.name}`,
        },
        forEachError: (error) => {
            console.log(error);
            // thing to do with each error
        },
        handleSuccess: (data) => {
            console.log(data);
            // thing do to on success
        },
        handleFailure: (error) => {
            console.log(error);
            // thing to do on failure
        },
        normalizer: (payload) => {
            /* 
                should take an RPCPayload and return a StandardPayload<OrderOrigin>
                used for working with supabase rpc functions where the return type isn't standard
            */
            return payload as unknown as StandardPayload<OrderOrigin>;
        },
    });
};

const useUpdateNewOrderOrigin = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<OrderOrigin, OrderOrigin>({
        interactor: updateOrderOrigin,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving changes...',
            success: (data) => `Successfully saved changes to ${data.name}`,
            mainError: (error) => error.message,
            errors: (data) => `Failed to save changes to ${data.name}`,
        },
        forEachError: (error) => {
            console.log(error);
            // thing to do with each error
        },
        handleSuccess: (data) => {
            console.log(data);
            // thing do to on success
        },
        handleFailure: (error) => {
            console.log(error);
            // thing to do on failure
        },
        normalizer: (payload) => {
            /* 
                should take an RPCPayload and return a StandardPayload<OrderOrigin>
                used for working with supabase rpc functions where the return type isn't standard
            */
            return payload as unknown as StandardPayload<OrderOrigin>;
        },
    });
};

export const useOrderOriginCRUD = ({ queryKey }: { queryKey: string[] }) => {
    return {
        orderOriginMutations: {
            // should have a separate type of interaction hook for each CRUD operation
            create: useCreateNewOrderOrigin({ queryKey }).mutate,
            update: useUpdateNewOrderOrigin({ queryKey }).mutate,
            // delete: useTemplateInteraction({ queryKey }).mutate,
        },
    };
};
