import { toast, UpdateOptions } from 'react-toastify';
import { Drawer, DriverDrawer } from '../typesAndValidators';

// action -> Message | id

// add orders -> Adding order(s) to drawer | adding
// remove orders -> Removing order(s) from drawer | removing

// orderSuccess -> Order(s) added to drawer | added

interface ToastPromiseProps {
    pending?: string | UpdateOptions<unknown>;
    success?: string | UpdateOptions<unknown>;
    error?: string | UpdateOptions<unknown>;
    timeout?: number;
}

export const toastPromise = ({ pending = 'Loading', success = 'Success!', error = 'Error!' }: ToastPromiseProps) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    toast.promise(promise, {
        pending,
        success,
        error,
    });
    return { resolve, reject };
};

type DataWithPayload = {
    message: string;
    payload?: unknown;
};

type DataWithErrors = {
    errors: { message: string; [key: string]: string | string[] }[];
};

export const addOrdersToast = (orderIDs: string[], drawer: Drawer | DriverDrawer) => {
    const { resolve, reject } = toastPromise({
        pending: {
            render: () => `Adding ${orderIDs.length} ticket${orderIDs.length > 1 ? 's' : ''} to ${drawer.name}`,
        },
        success: {
            render: ({ data }) => {
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
                const { errors } = data as DataWithErrors;
                return `Could not add ${errors.length} ticket${errors.length > 1 ? 's' : ''} to ${drawer.name}.`;
            },
            type: 'error',
            autoClose: 1000,
            isLoading: false,
        },
    });
    return { resolve, reject };
};

export const removeOrdersToast = (orderIDs: string[], drawer: Drawer | DriverDrawer) => {
    const { resolve, reject } = toastPromise({
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
                const { errors } = data as DataWithErrors;
                return `${errors?.length} order(s) could not be removed from ${drawer.name}.`;
            },
            type: 'error',
            isLoading: false,
            autoClose: 2000,
        },
    });
    return { resolve, reject };
};
