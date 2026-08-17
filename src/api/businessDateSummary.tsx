import { supaClient } from '../supaClient';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { BusinessDaySummary } from '../typesAndValidators';
import dayjs from 'dayjs';

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
    const queryKey = ['businessDaySummaries', businessDate.format('YYYY-MM-DD')];

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
