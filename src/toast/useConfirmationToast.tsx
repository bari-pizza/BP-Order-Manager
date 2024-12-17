// TODO: create a simple toast.error wrapper that uses a sad pizza icon
// TODO: create a simple toast.success wrapper that uses a happy pizza icon
// TODO: create a toast.confirmation wrapper - should have an onConfirm function

import { Button, ButtonProps, Stack, Typography } from '@mui/material';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

type useConfirmationToastProps = {
    message: string;
    confirmProps: ButtonProps & {
        handler: (...args: never[]) => void;
        buttonText?: string;
    };
    cancelProps?: ButtonProps & {
        handler?: (...args: never[]) => void;
        buttonText?: string;
    };
};

export const useConfirmationToast = ({ message, confirmProps, cancelProps }: useConfirmationToastProps) => {
    const { handler: confirmHandler, buttonText: confirmButtonText, ...confirmButtonProps } = confirmProps;
    const { handler: cancelHandler, buttonText: cancelButtonText, ...cancelButtonProps } = cancelProps || {};

    const toastRef = useRef<Id>('');
    const handleConfirm = () => {
        confirmHandler();
        if (toastRef.current) {
            toast.dismiss(toastRef.current);
        }
    };

    const handleCancel = () => {
        if (cancelHandler) {
            cancelHandler();
        }
        if (toastRef.current) {
            toast.dismiss(toastRef.current);
        }
    };

    const content = (
        <Stack direction="column" sx={{ height: '100%', width: '200', textAlign: 'center' }} alignItems="center">
            <Typography>{message}</Typography>
            <Stack direction="row" spacing={2}>
                <Button onClick={handleConfirm} variant="contained" color="success" {...confirmButtonProps}>
                    {confirmButtonText || 'Confirm'}
                </Button>
                <Button onClick={handleCancel} variant="outlined" color="error" {...cancelButtonProps}>
                    {cancelButtonText || 'Cancel'}
                </Button>
            </Stack>
        </Stack>
    );
    const handleConfirmation = () => {
        toastRef.current = toast(content, {
            type: 'info',
            autoClose: false,
        });
    };

    return { handleConfirmation };
};

// const ExampleUsage = () => {
//     const { handleConfirmation } = useConfirmationToast({
//         message: 'Are you sure?',
//         confirmProps: {
//             handler: () => {
//                 alert('Confirmed');
//             },
//             buttonText: 'Do it!',
//         },
//         cancelProps: {
//             handler: () => {
//                 alert('Cancelled');
//             },
//             buttonText: 'Cancel',
//         },
//     });
//     const handleClick = () => {
//         handleConfirmation();
//     };

//     return <Button onClick={handleClick}>Confirm</Button>;
// };
