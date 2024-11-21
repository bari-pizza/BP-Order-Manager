import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { OneOfType } from '../typesAndValidators';

export type Payload<T> =
    | {
          data: { successes: T[]; failures: T[] };
      }
    // | {
    //       data: T[];
    //   }
    // | {
    //       error: PostgrestError;
    //   }
    | PostgrestResponse<T>;

export type StandardPayload<T> = {
    data: T[];
    mainError: PostgrestError | null;
    errors: T[] | null;
};

export const handlePayload = <T,>(payload: Payload<T>) => {
    const result: StandardPayload<T> = {
        data: [],
        mainError: null,
        errors: null,
    };
    // if ('data' in payload) {
    //     const data = payload.data;
    //     if ('successes' in data) {
    //         result.data = data.successes;
    //         result.errors = data.failures;
    //     } else {
    //         result.data = data;
    //     }else {
    //        result.mainError = payload.error;
    //    }
    if ('error' in payload && payload.error) {
        // Complete Failure
        throw payload.error;
    } else {
        const data = payload.data;
        if ('successes' in data) {
            result.data = data.successes;
            result.errors = data.failures;
        } else {
            result.data = data;
        }
    }
    return result;
};

// export type RPCPayload = {
//     data: unknown;
//     error: PostgrestError | null;
//     isRPC: true;
// };

export type RPCPayload = { isRPC: true } & OneOfType<{
    data: { successes: string[]; failures: { [key: string]: PostgrestError }[] };
    error: PostgrestError;
}>;

// export const handleRPCPayload = <T,>(payload: Payload<T>) => {
//     const result: RPCPayload = {
//         data: null,
//         error: null,
//         isRPC: true,
//     };
//     if ('data' in payload) {
//         result.data = payload.data;
//     } else {
//         result.error = payload.error;
//     }
//     return result;
// };

export type SupabaseInteractor<T, U> = {
    (data: T): Promise<StandardPayload<U>>;
};

export type SupabaseRPCInteractor<T> = {
    (data: T): Promise<RPCPayload>;
};

type GetMessages<T, U> = {
    pending: (data: T) => string;
    success: (data: U) => string;
    mainError: (error: PostgrestError | Error) => string;
    errors: (error: PostgrestError | Error) => string;
};

// const defaultNormalizer = <T,>(payload: RPCPayload) => {
//     return payload as unknown as StandardPayload<T>;
// };

// const isRPC = <T,>(result: StandardPayload<T> | RPCPayload): result is RPCPayload => {
//     return 'isRPC' in result;
// };

type UseInteractionHandlerProps<T, U> = {
    interactor: SupabaseInteractor<T, U>;
    queryKey: string[];
    getMessages: GetMessages<T, U>;
    // forEachError: (error: U) => void;
    handleSuccess?: (data: U[]) => void;
    handleFailure?: (error: Error) => void;
};

type UseRPCInteractionHandlerProps<T> = {
    interactor: SupabaseRPCInteractor<T>;
    queryKey: string[];
    getMessages: GetMessages<T, RPCPayload['data']>;
    forEachError: (error: PostgrestError) => void;
    handleSuccess?: (data: RPCPayload['data']) => void;
    handleFailure?: (error: PostgrestError | Error) => void;
};

export const useInteractionHandler = <T, U>({
    interactor,
    queryKey,
    getMessages,
    handleSuccess,
    handleFailure,
}: UseInteractionHandlerProps<T, U>) => {
    const toastRef = useRef<Id>('');
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: T) => {
            // I'd like to check for changes here
            // no changes -> don't do anything

            // const hasChanges = data !== queryClient.getQueryData(queryKey);
            // if (!hasChanges) {
            //     return;
            // }

            return interactor(data);
            // I can't normalize here because it's a promise
        },
        onMutate: (data: T) => {
            const loadingMessage = getMessages.pending(data);
            if (loadingMessage) {
                toastRef.current = toast.loading(loadingMessage);
            }
        },
        onSuccess: (payload: StandardPayload<U>) => {
            const successMessage = getMessages.success(payload.data[0]);
            queryClient.invalidateQueries({ queryKey });
            if (successMessage) {
                toast.update(toastRef.current, {
                    render: successMessage,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
            if (handleSuccess) {
                handleSuccess(payload.data);
            }
        },
        onError: (error: Error) => {
            // I think this only happens when an error is thrown
            // might need to add error throwing in the interactor
            console.log({ error });
            toast.update(toastRef.current, {
                render: <div dangerouslySetInnerHTML={{ __html: error.message }} />,
                type: 'error',
                isLoading: false,
                autoClose: 10000,
                closeButton: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
            if (handleFailure) {
                handleFailure(error);
            }
        },
    });
};

// USE IN FUTURE PROJECTS

export const useRPCInteractionHandler = <T,>({
    interactor,
    queryKey,
    getMessages,
    forEachError,
    handleSuccess,
    handleFailure,
}: UseRPCInteractionHandlerProps<T>) => {
    const toastRef = useRef<Id>('');
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: T) => {
            // I'd like to check for changes here
            // no changes -> don't do anything

            // const hasChanges = data !== queryClient.getQueryData(queryKey);
            // if (!hasChanges) {
            //     return;
            // }

            return interactor(data);
            // I can't normalize here because it's a promise
        },
        onMutate: (data: T) => {
            const loadingMessage = getMessages.pending(data);
            if (loadingMessage) {
                toastRef.current = toast.loading(loadingMessage);
            }
        },
        onSuccess: (payload) => {
            if (payload.data?.successes.length === 0) {
                throw new Error('Failed to save changes');
            }
            const successMessage = getMessages.success(payload.data);
            queryClient.invalidateQueries({ queryKey });
            if (successMessage) {
                toast.update(toastRef.current, {
                    render: successMessage,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
            // TODO: failures aren't coming through with the right shape
            // fix for both rpc functions probably
            console.log({ payload });
            payload.data?.failures.forEach((data) => {
                const error = Object.values(data)[0];
                const errorMessage = getMessages.errors(error);
                if (errorMessage) {
                    toast.error(errorMessage);
                }
                forEachError(error);
            });
            if (handleSuccess) {
                handleSuccess(payload.data);
            }
        },
        onError: (error) => {
            // I think this only happens when an error is thrown
            // might need to add error throwing in the interactor
            toast.update(toastRef.current, {
                render: <div dangerouslySetInnerHTML={{ __html: error.message }} />,
                type: 'error',
                isLoading: false,
                autoClose: 10000,
                closeButton: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
            if (handleFailure) {
                handleFailure(error);
            }
        },
    });
};
