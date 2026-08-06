import { supaClient } from '../supaClient';
import { NewPayment, Payment } from '../typesAndValidators';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';

const createNewPayment: SupabaseInteractor<NewPayment, Payment> = async (newPayment) => {
    const payload = (await supaClient.from('Payment').insert([newPayment]).select('*')) as Payload<Payment>;
    return handlePayload<Payment>(payload);
};

const updatePayment: SupabaseInteractor<Payment, Payment> = async (payment) => {
    const payload = (await supaClient
        .from('Payment')
        .update(payment)
        .eq('payment_id', payment.payment_id)
        .select('*')) as Payload<Payment>;
    return handlePayload<Payment>(payload);
};

const deletePayment: SupabaseInteractor<Payment, Payment> = async (payment) => {
    const payload = await supaClient.from('Payment').delete().eq('payment_id', payment.payment_id).select();
    return handlePayload<Payment>(payload);
};

const useCreateNewPayment = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewPayment, Payment>({
        interactor: createNewPayment,
        queryKey,
        getMessages: {
            pending: () => 'Creating new payment...',
            success: () => `Successfully created new payment.`,
            mainError: (error) => error!.message,
            errors: () => `Failed to create new payment.`,
        },
        handleSuccess: (data) => {
        },
    });
};

const useUpdatePayment = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<Payment, Payment>({
        interactor: updatePayment,
        queryKey,
        getMessages: {
            pending: () => 'Updating payment...',
            success: () => `Successfully updated payment`,
            mainError: (error) => error!.message,
            errors: () => `Failed to update payment`,
        },
    });
};

const useDeletePayment = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<Payment, Payment>({
        interactor: deletePayment,
        queryKey,
        getMessages: {
            pending: () => 'Deleting payment...',
            success: () => `Successfully deleted payment`,
            mainError: (error) => error!.message,
            errors: () => `Failed to delete payment`,
        },
    });
};

export const usePaymentCRUD = ({ queryKey }: { queryKey: string[] }) => {
    // add handleSuccessRef and handleFailureRef
    // const createNewPaymentMutation = useCreateNewPayment({
    //     queryKey,
    //     handleSuccessRef: {},
    //     handleFailureRef: {},
    // }).mutate;
    return {
        paymentMutations: {
            create: useCreateNewPayment({ queryKey }).mutate,
            update: useUpdatePayment({ queryKey }).mutate,
            delete: useDeletePayment({ queryKey }).mutate,
        },
    };
};
