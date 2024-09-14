import { supaClient } from '../supaClient';
import { handlePayload, Payload, StandardPayload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { BusinessDayDrawerSummary } from '../typesAndValidators';
import dayjs from 'dayjs';
import { useSuspenseQuery } from '@tanstack/react-query';

const upsertBusinessDayDrawerSummary: SupabaseInteractor<BusinessDayDrawerSummary, BusinessDayDrawerSummary> = async (
    businessDayDrawerSummary,
) => {
    const payload = (await supaClient
        .from('BusinessDayDrawer')
        .upsert(businessDayDrawerSummary, { onConflict: 'drawer_id, business_date' })
        .select('*')) as Payload<BusinessDayDrawerSummary>;
    return handlePayload<BusinessDayDrawerSummary>(payload);
};

const getAllBusinessDayDrawerSummary = async ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const { data, error } = await supaClient.from('BusinessDayDrawer').select('*').eq('business_date', businessDate);
    if (error) {
        console.error(error);
        return [];
    }
    if (!data || data.length === 0) return [];

    return data as unknown as BusinessDayDrawerSummary[];
};

const useGetAllBusinessDayDrawerSummary = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    return useSuspenseQuery({
        queryKey: [businessDate.format('YYYY-MM-DD')],
        queryFn: () => getAllBusinessDayDrawerSummary({ businessDate }),
    });
};

const useUpsertBusinessDayDrawerSummary = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<BusinessDayDrawerSummary, BusinessDayDrawerSummary>({
        interactor: upsertBusinessDayDrawerSummary,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving data...',
            success: () => `Save successful`,
            mainError: (error) => error.message,
            errors: () => `Failed to save data`,
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
                should take an RPCPayload and return a StandardPayload<BusinessDayDrawerSummary>
                used for working with supabase rpc functions where the return type isn't standard
            */
            return payload as unknown as StandardPayload<BusinessDayDrawerSummary>;
        },
    });
};

export const useBusinessDayDrawerSummaryCRUD = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const queryKey = [businessDate.format('YYYY-MM-DD')];
    return {
        businessDayDrawerSummaryMutations: {
            // should have a separate type of interaction hook for each CRUD operation
            // create: useCreateBusinessDayDrawerSummary({ queryKey }).mutate,
            getAll: useGetAllBusinessDayDrawerSummary({ businessDate }),
            // getOne: useGetOneBusinessDayDrawerSummary({ businessDate, drawerID }),
            upsert: useUpsertBusinessDayDrawerSummary({ queryKey }).mutate,
            // delete: useTemplateInteraction({ queryKey }).mutate,
        },
    };
};
