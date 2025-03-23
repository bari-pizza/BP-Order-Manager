// DEPRECATED - USE src/api/helpers.tsx instead
import { UpdateOptions } from 'react-toastify';
import { toast } from '../toast/toastWrapper';

// TODO: add a way to undo changes

interface ToastPromiseProps {
    pending?: string | UpdateOptions<unknown>;
    success?: string | UpdateOptions<unknown>;
    error?: string | UpdateOptions<unknown>;
    timeout?: number;
}

interface HandleOutcomeWrapperProps<T> {
    resolve: Resolve<T>;
    reject: Reject;
}
export interface HandleOutcomeProps {
    data?: DataWithPayload | null;
    errors?: DataWithError[];
    forEachError?: (error: DataWithError) => void;
}

const handleOutcomeWrapper = ({ resolve, reject }: HandleOutcomeWrapperProps<DataWithPayload>) => {
    const handleOutcome = ({ data, errors, forEachError }: HandleOutcomeProps) => {
        let promiseFulfilled = false;
        if (data) {
            // console.log('calling resolve');
            resolve(data);
            promiseFulfilled = true;
        }
        if (errors?.length) {
            if (!promiseFulfilled) {
                // console.log('calling reject');
                reject(errors);
                promiseFulfilled = true;
            } else {
                // console.log('promise already fulfilled, cannot reject');
            }
            if (forEachError) {
                errors.forEach(forEachError);
            }
        }
    };
    return handleOutcome;
};

export const toastPromise = ({ pending = 'Loading', success = 'Success!', error = 'Error!' }: ToastPromiseProps) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    toast.promise(promise, {
        pending,
        success,
        error,
    });
    const handleOutcome = handleOutcomeWrapper({ resolve, reject });
    return { handleOutcome };
};

export type DataWithPayload = {
    message?: string;
    payload?: unknown;
};

export type DataWithError = {
    message?: string;
    [key: string]: string | undefined;
};
