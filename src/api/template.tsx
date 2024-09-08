import { supaClient } from '../supaClient';
import { handlePayload, Payload, StandardPayload, SupabaseInteractor, useInteractionHandler } from './helpers';

type IncomingDataType = {
    [key: string]: string;
};

type OutgoingDataType = {
    [key: string]: string;
};

const templateInteractor: SupabaseInteractor<IncomingDataType, OutgoingDataType> = async (newPayment) => {
    const payload = (await supaClient.from('Payment').insert([newPayment]).select('*')) as Payload<OutgoingDataType>;
    return handlePayload<OutgoingDataType>(payload);
};

const useTemplateInteraction = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<IncomingDataType, OutgoingDataType>({
        interactor: templateInteractor,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Loading message goes here...',
            success: (data) => `Successfully updated db: ${data.id}`,
            mainError: (error) => error.message,
            errors: (data) => `Failed to create new payment: ${data.id}`,
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
                should take an RPCPayload and return a StandardPayload<OutgoingDataType>
                used for working with supabase rpc functions where the return type isn't standard
            */
            return payload as unknown as StandardPayload<OutgoingDataType>;
        },
    });
};

const useTemplateInteractionCRUD = ({ queryKey }: { queryKey: string[] }) => {
    return {
        useTemplateMutations: {
            // should have a separate type of interaction hook for each CRUD operation
            create: useTemplateInteraction({ queryKey }).mutate,
            update: useTemplateInteraction({ queryKey }).mutate,
            delete: useTemplateInteraction({ queryKey }).mutate,
        },
    };
};

export default { ONLY_FOR_DEMONSTRATION_PURPOSES: useTemplateInteractionCRUD };
