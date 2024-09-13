import { supaClient } from '../supaClient';
import { handlePayload, Payload, StandardPayload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { BusinessDayDrawerSummary } from '../typesAndValidators';
import dayjs from 'dayjs';
import { useSuspenseQuery } from '@tanstack/react-query';

type BusinessDayDrawerSummaryID = {
    drawerID?: string;
    businessDate: dayjs.Dayjs;
};
/*
export const getAllOrigins = async () => {
    const { data, error } = await supaClient.from('OrderOrigin').select('*').order('name', { ascending: true });
    if (error) {
        console.error(error);
        return [] as OrderOrigin[];
    }

    return data as unknown as OrderOrigin[];
};
*/

const upsertBusinessDayDrawerSummary: SupabaseInteractor<BusinessDayDrawerSummary, BusinessDayDrawerSummary> = async (
    businessDayDrawerSummary,
) => {
    const payload = (await supaClient
        .from('BusinessDayDrawer')
        .upsert(businessDayDrawerSummary, { onConflict: 'drawer_id, business_date' })
        .select('*')) as Payload<BusinessDayDrawerSummary>;
    return handlePayload<BusinessDayDrawerSummary>(payload);
};

// const updateBusinessDayDrawerSummary: SupabaseInteractor<BusinessDayDrawerSummary, BusinessDayDrawerSummary> = async (
//     businessDayDrawerSummary,
// ) => {
//     const payload = (await supaClient
//         .from('BusinessDayDrawerSummary')
//         .upsert([businessDayDrawerSummary])
//         .eq('drawer_id', businessDayDrawerSummary.drawer_id)
//         .eq('business_date', businessDayDrawerSummary.business_date)
//         .select('*')) as Payload<BusinessDayDrawerSummary>;
//     return handlePayload<BusinessDayDrawerSummary>(payload);
// };

const getOneBusinessDayDrawerSummary = async ({ businessDate, drawerID }: BusinessDayDrawerSummaryID) => {
    if (!drawerID) return null;
    const { data, error } = await supaClient
        .from('BusinessDayDrawer')
        .select('*')
        .eq('drawer_id', drawerID)
        .eq('business_date', businessDate);
    // return handlePayload<BusinessDayDrawerSummary>(payload);
    if (error) {
        console.error(error);
        return null;
    }
    if (!data || data.length === 0) return null;

    return data[0] as unknown as BusinessDayDrawerSummary;
};

const useGetOneBusinessDayDrawerSummary = ({ businessDate, drawerID }: BusinessDayDrawerSummaryID) => {
    return useSuspenseQuery({
        queryKey: [businessDate.format('YYYY-MM-DD'), drawerID],
        queryFn: () => getOneBusinessDayDrawerSummary({ businessDate, drawerID }),
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

// const useUpdateBusinessDayDrawerSummary = ({ queryKey }: { queryKey: string[] }) => {
//     return useInteractionHandler<BusinessDayDrawerSummary, BusinessDayDrawerSummary>({
//         interactor: updateBusinessDayDrawerSummary,
//         queryKey,
//         getMessages: {
//             // return '' or null if no message necessary
//             pending: () => 'Saving changes...',
//             success: () => `Changes saved successfully`,
//             mainError: (error) => error.message,
//             errors: () => `Failed to save changes`,
//         },
//         forEachError: (error) => {
//             console.log(error);
//             // thing to do with each error
//         },
//         handleSuccess: (data) => {
//             console.log(data);
//             // thing do to on success
//         },
//         handleFailure: (error) => {
//             console.log(error);
//             // thing to do on failure
//         },
//         normalizer: (payload) => {
//             /*
//                 should take an RPCPayload and return a StandardPayload<BusinessDayDrawerSummary>
//                 used for working with supabase rpc functions where the return type isn't standard
//             */
//             return payload as unknown as StandardPayload<BusinessDayDrawerSummary>;
//         },
//     });
// };

export const useBusinessDayDrawerSummaryCRUD = ({ businessDate, drawerID }: BusinessDayDrawerSummaryID) => {
    const queryKey = [businessDate.format('YYYY-MM-DD'), drawerID || ''];
    return {
        businessDayDrawerSummaryMutations: {
            // should have a separate type of interaction hook for each CRUD operation
            // create: useCreateBusinessDayDrawerSummary({ queryKey }).mutate,
            getOne: useGetOneBusinessDayDrawerSummary({ businessDate, drawerID }),
            upsert: useUpsertBusinessDayDrawerSummary({ queryKey }).mutate,
            // delete: useTemplateInteraction({ queryKey }).mutate,
        },
    };
};
