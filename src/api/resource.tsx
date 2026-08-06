import { supaClient } from '../supaClient';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { Resource } from '../typesAndValidators';

// type NewOrderOrigin = Omit<OrderOrigin, 'origin_id'>;

// const createNewOrderOrigin: SupabaseInteractor<NewOrderOrigin, OrderOrigin> = async (newOrderOrigin) => {
//     const payload = (await supaClient.from('OrderOrigin').insert([newOrderOrigin]).select('*')) as Payload<OrderOrigin>;
//     return handlePayload<OrderOrigin>(payload);
// };

const updateResource: SupabaseInteractor<Resource, Resource> = async (resource) => {
    const payload = (await supaClient
        .from('Resource')
        .update([resource])
        .eq('title', resource.title)
        .select('*')) as Payload<Resource>;
    return handlePayload<Resource>(payload);
};

// const useCreateNewOrderOrigin = ({ queryKey }: { queryKey: string[] }) => {
//     return useInteractionHandler<NewOrderOrigin, OrderOrigin>({
//         interactor: createNewOrderOrigin,
//         queryKey,
//         getMessages: {
//             // return '' or null if no message necessary
//             pending: () => 'Saving new order origin...',
//             success: (data) => `Successfully saved new order origin: ${data.name}`,
//             mainError: (error) => error!.message,
//             errors: () => `Failed to create new order origin`,
//         },
//         handleSuccess: (data) => {
//             // thing do to on success
//         },
//         handleFailure: (error) => {
//             // thing to do on failure
//         },
//     });
// };

const useUpdateResource = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<Resource, Resource>({
        interactor: updateResource,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving changes...',
            success: (data) => `Successfully saved changes to ${data.title}`,
            mainError: (error) => error!.message,
            errors: () => `Failed to save changes`,
        },
        handleSuccess: (data) => {
            // thing do to on success
        },
        handleFailure: (error) => {
            // thing to do on failure
        },
    });
};

export const useResourceCRUD = ({ queryKey }: { queryKey: string[] }) => {
    return {
        resourceMutations: {
            // should have a separate type of interaction hook for each CRUD operation
            // create: useCreateNewOrderOrigin({ queryKey }).mutate,
            update: useUpdateResource({ queryKey }).mutate,
            // delete: useTemplateInteraction({ queryKey }).mutate,
        },
    };
};
