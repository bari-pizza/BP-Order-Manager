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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Id, toast } from '../toast/toastWrapper';

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

    // Soft failures come back as JSON { error: "..." } with a 200 from PostgREST.
    if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error) {
        throw new Error(String((data as { error: string }).error));
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

    if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error) {
        throw new Error(String((data as { error: string }).error));
    }

    return data as unknown as RPCPayload;
};


const useUpsertBusinessDayDrawer = ({ queryKey }: { queryKey: string[] }) => {
    const queryClient = useQueryClient();
    const toastRef = useRef<Id>('');

    return useMutation({
        mutationFn: upsertBusinessDayDrawer,
        onMutate: async (summary: BusinessDayDrawerSummary) => {
            toastRef.current = toast.loading('Saving data...');
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<BusinessDayDrawerSummary[]>(queryKey);

            // Optimistic: outstanding / form reset must see hours immediately, not after the round-trip.
            queryClient.setQueryData<BusinessDayDrawerSummary[]>(queryKey, (current = []) => {
                const index = current.findIndex(
                    (row) => row.drawer_id === summary.drawer_id && row.business_date === summary.business_date,
                );
                if (index === -1) {
                    return [...current, summary];
                }
                const next = [...current];
                next[index] = { ...current[index], ...summary };
                return next;
            });

            return { previous };
        },
        onError: (error: Error, _summary, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
            toast.update(toastRef.current, {
                render: <div dangerouslySetInnerHTML={{ __html: error.message }} />,
                type: 'error',
                isLoading: false,
                autoClose: 10000,
                closeButton: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
        },
        onSuccess: (payload) => {
            const saved = payload.data[0];
            if (saved) {
                queryClient.setQueryData<BusinessDayDrawerSummary[]>(queryKey, (current = []) => {
                    const index = current.findIndex(
                        (row) => row.drawer_id === saved.drawer_id && row.business_date === saved.business_date,
                    );
                    if (index === -1) {
                        return [...current, saved];
                    }
                    const next = [...current];
                    next[index] = saved;
                    return next;
                });
            }
            queryClient.invalidateQueries({ queryKey });
            toast.update(toastRef.current, {
                render: 'Save successful',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });
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
    const upsertBusinessDayDrawerMutation = useUpsertBusinessDayDrawer({ queryKey });
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
            upsert: upsertBusinessDayDrawerMutation.mutate,
            upsertAsync: upsertBusinessDayDrawerMutation.mutateAsync,
            isUpserting: upsertBusinessDayDrawerMutation.isPending,
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
                    handleSuccessRef.current['closeBusinessDayDrawer'] = handleSuccess;
                }
                if (handleFailure) {
                    handleFailureRef.current['closeBusinessDayDrawer'] = handleFailure;
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
