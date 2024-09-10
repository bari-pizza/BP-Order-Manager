// DEPRECATED - USE src/api/helpers.tsx instead

import { toastPromise, DataWithError, DataWithPayload } from './toast';
import { Drawer, Driver_Drawer } from '../typesAndValidators';

export const addOrdersToast = (orderIDs: string[], drawer: Drawer | Driver_Drawer) => {
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

export const removeOrdersToast = (orderIDs: string[], drawer: Drawer | Driver_Drawer) => {
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
