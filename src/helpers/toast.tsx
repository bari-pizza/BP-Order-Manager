import { toast, UpdateOptions } from 'react-toastify';
import { Drawer, DriverDrawer } from '../typesAndValidators';

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

type DataWithPayload = {
    message?: string;
    payload?: unknown;
};

export type DataWithError = {
    message?: string;
    [key: string]: string | undefined;
};

// TODO: create a simple toast.error wrapper that uses a sad pizza icon
// TODO: create a simple toast.success wrapper that uses a happy pizza icon

export const addOrdersToast = (orderIDs: string[], drawer: Drawer | DriverDrawer) => {
    const { handleOutcome } = toastPromise({
        pending: {
            render: () => `Adding ${orderIDs.length} ticket${orderIDs.length > 1 ? 's' : ''} to ${drawer.name}`,
        },
        success: {
            render: (props) => {
                const { data } = props;
                const { payload } = data as DataWithPayload;
                const { orderIDs } = payload as { orderIDs: string[] };
                return `Added ${orderIDs.length} ticket${orderIDs.length > 1 ? 's' : ''} to ${drawer.name}`;
            },
            type: 'success',
            isLoading: false,
            autoClose: 1000,
        },
        error: {
            render: ({ data }) => {
                const errors = data as DataWithError[];
                return `Could not add ${errors.length} ticket${errors.length > 1 ? 's' : ''} to ${drawer.name}.`;
            },
            type: 'error',
            autoClose: 1000,
            isLoading: false,
        },
    });
    return handleOutcome;
};

export const removeOrdersToast = (orderIDs: string[], drawer: Drawer | DriverDrawer) => {
    const { handleOutcome } = toastPromise({
        pending: {
            render: () => `Removing ${orderIDs.length} ticket${orderIDs.length > 1 ? 's' : ''} from ${drawer.name}`,
        },
        success: {
            render: ({ data }) => {
                const { payload } = data as DataWithPayload;
                const { orderIDs } = payload as { orderIDs: string[] };
                return `Removed ${orderIDs.length} ticket${orderIDs.length > 1 ? 's' : ''} from ${drawer.name}`;
            },
            type: 'success',
            isLoading: false,
            autoClose: 1000,
        },
        error: {
            render: ({ data }) => {
                const errors = data as DataWithError[];
                return `${errors?.length} order(s) could not be removed from ${drawer.name}.`;
            },
            type: 'error',
            isLoading: false,
            autoClose: 2000,
        },
    });
    return handleOutcome;
};
