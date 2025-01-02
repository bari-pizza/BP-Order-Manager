import dayjs from 'dayjs';
import { supaClient } from '../supaClient';
import { CashTransfer, NewCashTransfer } from '../typesAndValidators';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';
// import { useSuspenseQuery } from '@tanstack/react-query';

// const getAllDaysCashTransfers = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     const { data, error } = await supaClient
//         .from('CashTransfer')
//         .select('*')
//         .eq('business_date', businessDate.format('YYYY-MM-DD'));

//     if (error) {
//         console.error(error);
//         return [];
//     }
//     if (!data || data.length === 0) return [];

//     return data as unknown as CashTransfer[];
// };

const createNewCashTransfer: SupabaseInteractor<NewCashTransfer, CashTransfer> = async (newCashTransfer) => {
    const payload = (await supaClient
        .from('CashTransfer')
        .insert([newCashTransfer])
        .select('*')) as Payload<CashTransfer>;
    return handlePayload<CashTransfer>(payload);
};

const updateCashTransfer: SupabaseInteractor<CashTransfer, CashTransfer> = async (cashTransfer) => {
    const payload = (await supaClient
        .from('CashTransfer')
        .update(cashTransfer)
        .eq('cash_transfer_id', cashTransfer.cash_transfer_id)
        .select('*')) as Payload<CashTransfer>;
    return handlePayload<CashTransfer>(payload);
};

const deleteCashTransfer: SupabaseInteractor<CashTransfer, CashTransfer> = async (cashTransfer) => {
    const payload = await supaClient
        .from('CashTransfer')
        .delete()
        .eq('cash_transfer_id', cashTransfer.cash_transfer_id)
        .select();
    return handlePayload<CashTransfer>(payload);
};

// const useGetAllDaysCashTransfers = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     return useSuspenseQuery({
//         queryKey: ['cashTransfers', businessDate.format('YYYY-MM-DD')],
//         queryFn: () => getAllDaysCashTransfers({ businessDate }),
//         refetchOnWindowFocus: false,
//         staleTime: 1000 * 60 * 30,
//     });
// };

const useCreateNewCashTransfer = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewCashTransfer, CashTransfer>({
        interactor: createNewCashTransfer,
        queryKey,
        getMessages: {
            pending: () => 'Creating new cash transfer',
            success: () => `Successfully created new cash transfer.`,
            mainError: (error) => error.message,
            errors: () => `Failed to create new cash transfer.`,
        },
        handleSuccess: (data) => {
            console.log({ data });
        },
    });
};

const useUpdateCashTransfer = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<CashTransfer, CashTransfer>({
        interactor: updateCashTransfer,
        queryKey,
        getMessages: {
            pending: () => 'Updating cash transfer...',
            success: () => `Successfully updated cash transfer`,
            mainError: (error) => error.message,
            errors: () => `Failed to update cash transfer`,
        },
    });
};

const useDeleteCashTransfer = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<CashTransfer, CashTransfer>({
        interactor: deleteCashTransfer,
        queryKey,
        getMessages: {
            pending: () => 'Deleting cash transfer...',
            success: () => `Successfully deleted cash transfer`,
            mainError: (error) => error.message,
            errors: () => `Failed to delete cash transfer`,
        },
    });
};

export const useCashTransferAPI = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const queryKey = ['cashTransfers', businessDate.format('YYYY-MM-DD')];
    return {
        cashTransferAPI: {
            // getAll: useGetAllDaysCashTransfers({ businessDate }),
            create: useCreateNewCashTransfer({ queryKey }).mutate,
            update: useUpdateCashTransfer({ queryKey }).mutate,
            delete: useDeleteCashTransfer({ queryKey }).mutate,
        },
    };
};
