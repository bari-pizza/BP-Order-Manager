// TODO: create a simple toast.error wrapper that uses a sad pizza icon
// TODO: create a simple toast.success wrapper that uses a happy pizza icon
// TODO: create a toast.confirmation wrapper - should have an onConfirm function

import { Button, ButtonProps, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type useConfirmationToastProps = {
    message: string;
    renderBody?: (...args: unknown[]) => JSX.Element;
    confirmProps: ButtonProps & {
        handler: (...args: unknown[]) => void;
        buttonText?: string;
    };
    cancelProps?: ButtonProps & {
        handler?: (...args: unknown[]) => void;
        buttonText?: string;
    };
};

export const useConfirmationToast = ({ message, renderBody, confirmProps, cancelProps }: useConfirmationToastProps) => {
    const { handler: confirmHandler, buttonText: confirmButtonText, ...confirmButtonProps } = confirmProps;
    const { handler: cancelHandler, buttonText: cancelButtonText, ...cancelButtonProps } = cancelProps || {};
    const [payload, setPayload] = useState<unknown[]>([]);

    const toastId = 'confirmation-toast';

    const handleConfirmation = (...args: unknown[]) => {
        setPayload(args);
    };

    useEffect(() => {
        if (payload.length > 0) {
            const body = payload && renderBody ? renderBody(...payload) : null;

            const handleConfirm = () => {
                confirmHandler(...payload);
                setPayload([]);
                toast.dismiss(toastId);
            };

            const handleCancel = () => {
                if (cancelHandler) {
                    cancelHandler(...payload);
                }
                toast.dismiss(toastId);
                setPayload([]); // this was commented out but I put it back in
            };

            const content = (
                <Stack
                    direction="column"
                    sx={{ height: '100%', width: '200', textAlign: 'center' }}
                    alignItems="center">
                    <Typography>{message}</Typography>
                    {body}
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

            if (!toast.isActive(toastId)) {
                toast(content, {
                    toastId, // Use the same ID
                    type: 'info',
                    autoClose: false,
                });
            } else {
                toast.update(toastId, {
                    render: content,
                    type: 'info',
                    autoClose: false,
                });
            }
        }
    }, [
        cancelButtonProps,
        cancelButtonText,
        cancelHandler,
        confirmButtonProps,
        confirmButtonText,
        confirmHandler,
        message,
        payload,
        renderBody,
    ]);

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
