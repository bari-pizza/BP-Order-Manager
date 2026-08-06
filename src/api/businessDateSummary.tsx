import { supaClient } from '../supaClient';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { BusinessDaySummary } from '../typesAndValidators';
import dayjs from 'dayjs';
// import { useSuspenseQuery } from '@tanstack/react-query';

// const getBusinessDaySummary = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     const { data, error } = await supaClient
//         .from('BusinessDaySummary')
//         .select('*')
//         .eq('business_date', businessDate.format('YYYY-MM-DD'));

//     if (error) {
//         // debug removed
//         return [] as BusinessDaySummary[];
//     }
//     if (!data || data.length === 0) return [] as BusinessDaySummary[];

//     return [data[0] as unknown as BusinessDaySummary];
// };

const upsertBusinessDaySummary: SupabaseInteractor<BusinessDaySummary, BusinessDaySummary> = async (
    newBusinessDaySummary,
) => {
    const payload = (await supaClient
        .from('BusinessDaySummary')
        .upsert(newBusinessDaySummary, { onConflict: 'business_date' })
        .select('*')) as Payload<BusinessDaySummary>;
    return handlePayload<BusinessDaySummary>(payload);
};

// const useGetToday = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
//     return useSuspenseQuery({
//         queryKey: ['businessDaySummary', businessDate.format('YYYY-MM-DD')],
//         queryFn: () => getBusinessDaySummary({ businessDate }),
//         refetchOnWindowFocus: false,
//         staleTime: 1000 * 60 * 30,
//     });
// };

const useUpsertBusinessDaySummary = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<BusinessDaySummary, BusinessDaySummary>({
        interactor: upsertBusinessDaySummary,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Updating business day...',
            success: (data) =>
                `Successfully ${data.is_locked ? 'closed' : 'reopened'} business day: ${data.business_date}`,
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

export const useBusinessDaySummaryAPI = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const queryKey = ['businessDaySummary', businessDate.format('YYYY-MM-DD')];

    const upsert = useUpsertBusinessDaySummary({ queryKey }).mutate;

    return {
        businessDaySummaryAPI: {
            // getToday: useGetToday({ businessDate }),
            open: () => upsert({ business_date: businessDate.format('YYYY-MM-DD'), is_locked: false }),
            close: () => upsert({ business_date: businessDate.format('YYYY-MM-DD'), is_locked: true }),
            // callRPC:
        },
    };
};
