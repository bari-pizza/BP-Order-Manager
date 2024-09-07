import { PostgrestError } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

export type Payload<T> =
    | {
          data: T[];
      }
    | {
          error: PostgrestError;
      }
    | {
          data: { successes: T[]; failures: T[] };
      };

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
    if ('data' in payload) {
        const data = payload.data;
        if ('successes' in data) {
            result.data = data.successes;
            result.errors = data.failures;
        } else {
            result.data = data;
        }
    } else {
        result.mainError = payload.error;
    }
    return result;
};

export type RPCPayload = {
    data: unknown;
    error: PostgrestError | null;
    isRPC: true;
};

type SupabaseInteractorResult<T> = Promise<StandardPayload<T>> | Promise<RPCPayload>;

export type SupabaseInteractor<T, U> = {
    (data: T): SupabaseInteractorResult<U>;
};

type GetMessages<T, U> = {
    pending: (data: T) => string;
    success: (data: U) => string;
    mainError: (error: PostgrestError) => string;
    errors: (data: U) => string;
};

const defaultNormalizer = <T,>(payload: RPCPayload) => {
    return payload as unknown as StandardPayload<T>;
};

const isRPC = <T,>(result: StandardPayload<T> | RPCPayload): result is RPCPayload => {
    return 'isRPC' in result;
};

type UseInteractionHandlerProps<T, U> = {
    interactor: SupabaseInteractor<T, U>;
    queryKey: string[];
    getMessages: GetMessages<T, U>;
    normalizer?: (payload: RPCPayload) => StandardPayload<U>;
    forEachError: (error: U) => void;
    handleSuccess?: (data: U) => void;
    handleFailure?: (error: Error) => void;
};

export const useInteractionHandler = <T, U>({
    interactor,
    queryKey,
    getMessages,
    normalizer = defaultNormalizer,
    forEachError,
    handleSuccess,
    handleFailure,
}: UseInteractionHandlerProps<T, U>) => {
    const toastRef = useRef<Id>('');
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: T) => {
            return interactor(data);
            // I can't normalize here because it's a promise
        },
        onMutate: (data: T) => {
            const loadingMessage = getMessages.pending(data);
            if (loadingMessage) {
                toastRef.current = toast.loading(loadingMessage);
            }
        },
        onSuccess: (payload: StandardPayload<U> | RPCPayload) => {
            const normalized = isRPC(payload) ? normalizer(payload) : payload;
            const successMessage = getMessages.success(normalized.data[0]);
            queryClient.invalidateQueries({ queryKey });
            if (successMessage) {
                toast.update(toastRef.current, {
                    render: successMessage,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
            if (normalized.errors) {
                normalized.errors.forEach((data) => {
                    const errorMessage = getMessages.errors(data);
                    if (errorMessage) {
                        toast.error(errorMessage);
                    }
                    forEachError(data);
                });
            }
            if (handleSuccess) {
                handleSuccess(normalized.data[0]);
            }
        },
        onError: (error: Error) => {
            // I think this only happens when an error is thrown
            // might need to add error throwing in the interactor
            toast.update(toastRef.current, {
                render: error.message,
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
            if (handleFailure) {
                handleFailure(error);
            }
        },
    });
};

// USE IN FUTURE PROJECTS
