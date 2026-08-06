import { supaClient } from '../supaClient';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';

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
            mainError: (error) => error!.message,
            errors: () => `Failed to update db`,
        },
        handleSuccess: (data) => {
            // thing do to on success
        },
        handleFailure: (error) => {
            // thing to do on failure
        },
    });
};

const useTemplateInteractionCRUD = ({ queryKey }: { queryKey: string[] }) => {
    return {
        templateMutations: {
            // should have a separate type of interaction hook for each CRUD operation
            create: useTemplateInteraction({ queryKey }).mutate,
            update: useTemplateInteraction({ queryKey }).mutate,
            delete: useTemplateInteraction({ queryKey }).mutate,
            // callRPC:
        },
    };
};

export default { ONLY_FOR_DEMONSTRATION_PURPOSES: useTemplateInteractionCRUD };
