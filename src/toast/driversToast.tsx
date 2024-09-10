// DEPRECATED - USE src/api/helpers.tsx instead
import { Stack, Typography } from '@mui/material';
import { toastPromise, DataWithError } from './toast';
import dayjs from 'dayjs';

export const addDriverToBusinessDayToast = (driverName: string, businessDate: dayjs.Dayjs) => {
    const businessDay = businessDate.format('MM/DD/YYYY');
    const { handleOutcome } = toastPromise({
        pending: {
            render: () => `Adding ${driverName} to ${businessDay}`,
        },
        success: {
            render: () => `Added ${driverName} to ${businessDay}`,
            type: 'success',
            isLoading: false,
            autoClose: 1000,
        },
        // TODO: create a custom error message for duplicate row using triggers
        error: {
            render: ({ data }) => {
                const errors = data as DataWithError[];
                const message = errors[0]?.message;
                return (
                    <Stack direction="column">
                        <Typography variant="body1">
                            Could not add {driverName} to {businessDay}:
                        </Typography>
                        <Typography variant="body1">{message}</Typography>
                    </Stack>
                );
            },
            type: 'error',
            isLoading: false,
            autoClose: 4000,
        },
    });
    return handleOutcome;
};

export const removeDriverFromBusinessDayToast = (driverName: string, businessDate: dayjs.Dayjs) => {
    const businessDay = businessDate.format('MM/DD/YYYY');
    const { handleOutcome } = toastPromise({
        pending: {
            render: () => `Removing ${driverName} from ${businessDay}`,
        },
        success: {
            render: () => `Removed ${driverName} from ${businessDay}`,
            type: 'success',
            isLoading: false,
            autoClose: 1000,
        },
        error: {
            render: ({ data }) => {
                const errors = data as DataWithError[];
                const message = errors[0]?.message;
                return `Could not remove ${driverName} from ${businessDay}: ${message}`;
            },
            type: 'error',
            isLoading: false,
            autoClose: 4000,
        },
    });
    return handleOutcome;
};
