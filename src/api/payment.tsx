import { supaClient } from '../supaClient';
import { NewPayment, Payment } from '../typesAndValidators';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';

const createNewPayment: SupabaseInteractor<NewPayment, Payment> = async (newPayment) => {
    const payload = (await supaClient.from('Payment').insert([newPayment]).select('*')) as Payload<Payment>;
    return handlePayload<Payment>(payload);
};

export const useCreateNewPayment = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewPayment, Payment>({
        interactor: createNewPayment,
        queryKey,
        getMessages: {
            pending: () => 'Creating new payment...',
            success: (data) => `Successfully created new payment: ${data.payment_id}`,
            mainError: (error) => error.message,
            errors: (data) => `Failed to create new payment: ${data.payment_id}`,
        },
        forEachError: (error) => {
            console.log(error);
        },
    });
};
