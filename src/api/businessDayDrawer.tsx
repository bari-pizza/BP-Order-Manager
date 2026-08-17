import { supaClient } from '../supaClient';
import {
    handlePayload,
    Payload,
    RPCPayload,
    SupabaseInteractor,
    SupabaseRPCInteractor,
    useInteractionHandler,
    useRPCInteractionHandler,
} from './helpers';
import { BusinessDayDrawerSummary } from '../typesAndValidators';
import dayjs from 'dayjs';
import { PostgrestError } from '@supabase/supabase-js';
import { useRef } from 'react';

const upsertBusinessDayDrawer: SupabaseInteractor<BusinessDayDrawerSummary, BusinessDayDrawerSummary> = async (
    businessDayDrawerSummary,
) => {
    const payload = (await supaClient
        .from('BusinessDayDrawer')
        .upsert(businessDayDrawerSummary, { onConflict: 'drawer_id, business_date' })
        .select('*')) as Payload<BusinessDayDrawerSummary>;
    return handlePayload<BusinessDayDrawerSummary>(payload);
};

// };

const closeBusinessDayDrawer: SupabaseRPCInteractor<{ drawerID: string; businessDate: dayjs.Dayjs }> = async ({
    drawerID,
    businessDate,
}) => {
    const { data, error } = await supaClient.rpc('lock_drawer', {
        p_drawer_id: drawerID,
        p_business_date: businessDate.format('YYYY-MM-DD'),
    });
    if (error) {
        throw error;
    }

    return data as unknown as RPCPayload;
};

const reopenBusinessDayDrawer: SupabaseRPCInteractor<{ drawerID: string; businessDate: dayjs.Dayjs }> = async ({
    drawerID,
    businessDate,
}) => {
    const { data, error } = await supaClient.rpc('unlock_drawer', {
        p_drawer_id: drawerID,
        p_business_date: businessDate.format('YYYY-MM-DD'),
    });
    if (error) {
        throw error;
    }

    return data as unknown as RPCPayload;
};


const useUpsertBusinessDayDrawer = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<BusinessDayDrawerSummary, BusinessDayDrawerSummary>({
        interactor: upsertBusinessDayDrawer,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving data...',
            success: () => `Save successful`,
            mainError: (error) => error!.message,
            errors: () => `Failed to save data`,
        },
        handleSuccess: (data) => {
            // Success callback
        },
        handleFailure: (error) => {
            // Failure callback
        },
    });
};

const useCloseBusinessDayDrawer = ({
    queryKey,
    handleSuccessRef,
    handleFailureRef,
}: {
    queryKey: string[];
    handleSuccessRef: React.MutableRefObject<{
        [key: string]: (response: RPCPayload['data']) => void;
    }>;
    handleFailureRef: React.MutableRefObject<{
        [key: string]: (error: PostgrestError | Error) => void;
    }>;
}) => {
    return useRPCInteractionHandler<{ drawerID: string; businessDate: dayjs.Dayjs }>({
        interactor: closeBusinessDayDrawer,
        queryKey,
        getMessages: {
            pending: () => 'Closing drawer...',
            success: () => `Successfully closed drawer`,
            mainError: () => `Failed to close drawer`,
            errors: (error) => error!.message,
        },
        forEachError: (error) => {
            // Error already handled by mutation
        },
        handleSuccess(response) {
            const handleSuccess = handleSuccessRef.current['closeBusinessDayDrawer'];
            if (handleSuccess) {
                handleSuccess(response);
            }
        },
        handleFailure(error) {
            const handleFailure = handleFailureRef.current['closeBusinessDayDrawer'];
            if (handleFailure) {
                handleFailure(error);
            }
        },
    });
};

const useReopenBusinessDayDrawer = ({
    queryKey,
    handleSuccessRef,
    handleFailureRef,
}: {
    queryKey: string[];
    handleSuccessRef: React.MutableRefObject<{
        [key: string]: (response: RPCPayload['data']) => void;
    }>;
    handleFailureRef: React.MutableRefObject<{
        [key: string]: (error: PostgrestError | Error) => void;
    }>;
}) => {
    return useRPCInteractionHandler<{ drawerID: string; businessDate: dayjs.Dayjs }>({
        interactor: reopenBusinessDayDrawer,
        queryKey,
        getMessages: {
            pending: () => 'Reopening drawer...',
            success: () => `Successfully reopened drawer`,
            mainError: () => `Failed to reopen drawer`,
            errors: (error) => error!.message,
        },
        forEachError: (error) => {
            // Error already handled by mutation
        },
        handleSuccess(response) {
            const handleSuccess = handleSuccessRef.current['reopenBusinessDayDrawer'];
            if (handleSuccess) {
                handleSuccess(response);
            }
        },
        handleFailure(error) {
            const handleFailure = handleFailureRef.current['reopenBusinessDayDrawer'];
            if (handleFailure) {
                handleFailure(error);
            }
        },
    });
};

export const useBusinessDayDrawerAPI = ({ businessDate }: { businessDate: dayjs.Dayjs }) => {
    const handleSuccessRef = useRef<{
        [key: string]: (response: RPCPayload['data']) => void;
    }>({});

    const handleFailureRef = useRef<{
        [key: string]: (error: PostgrestError | Error) => void;
    }>({});
    const queryKey = ['businessDayDrawerSummaries', businessDate.format('YYYY-MM-DD')];
    const closeBusinessDayDrawerMutation = useCloseBusinessDayDrawer({
        queryKey,
        handleSuccessRef,
        handleFailureRef,
    });
    const reopenBusinessDayDrawerMutation = useReopenBusinessDayDrawer({
        queryKey,
        handleSuccessRef,
        handleFailureRef,
    });
    return {
        businessDayDrawerAPI: {
            // should have a separate type of interaction hook for each CRUD operation
            // create: useCreateBusinessDayDrawerSummary({ queryKey }).mutate,
            // getAll: useGetAllBusinessDayDrawers({ businessDate }),
            // getOne: useGetOneBusinessDayDrawerSummary({ businessDate, drawerID }),
            upsert: useUpsertBusinessDayDrawer({ queryKey }).mutate,
            close: ({
                drawerID,
                handleSuccess,
                handleFailure,
            }: {
                drawerID: string;
                handleSuccess?: (response: RPCPayload['data']) => void;
                handleFailure?: (error: PostgrestError | Error) => void;
            }) => {
                if (handleSuccess) {
                    handleSuccessRef.current['addOrdersToDrawer'] = handleSuccess;
                }
                if (handleFailure) {
                    handleFailureRef.current['addOrdersToDrawer'] = handleFailure;
                }
                closeBusinessDayDrawerMutation.mutate({ drawerID, businessDate });
            },
            reOpen: ({
                drawerID,
                handleSuccess,
                handleFailure,
            }: {
                drawerID: string;
                handleSuccess?: (response: RPCPayload['data']) => void;
                handleFailure?: (error: PostgrestError | Error) => void;
            }) => {
                if (handleSuccess) {
                    handleSuccessRef.current['reopenBusinessDayDrawer'] = handleSuccess;
                }
                if (handleFailure) {
                    handleFailureRef.current['reopenBusinessDayDrawer'] = handleFailure;
                }
                reopenBusinessDayDrawerMutation.mutate({ drawerID, businessDate });
            },
        },
    };
};
