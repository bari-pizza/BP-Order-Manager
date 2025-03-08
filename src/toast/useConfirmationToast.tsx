// TODO: create a simple toast.error wrapper that uses a sad pizza icon
// TODO: create a simple toast.success wrapper that uses a happy pizza icon
// TODO: create a toast.confirmation wrapper - should have an onConfirm function

import { Button, ButtonProps, Stack, Typography, TypographyProps } from '@mui/material';

import { toast } from 'react-toastify';
// import { CustomCloseButton } from './CustomCloseButton';

// type useConfirmationToastProps = {
//     message: string | ((...args: unknown[]) => string);
//     renderBody?: (...args: unknown[]) => JSX.Element;
//     confirmProps: ButtonProps & {
//         handler: (...args: unknown[]) => void;
//         buttonText?: string;
//     };
//     cancelProps?: ButtonProps & {
//         handler?: (...args: unknown[]) => void;
//         buttonText?: string;
//     };
//     position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
// };

// // TODO: I think I could add a MessageParams and HandlerParams generic to this to not have to use ...args
// export const useConfirmationToast = ({
//     message,
//     renderBody,
//     confirmProps,
//     cancelProps,
//     position = 'top-right',
// }: useConfirmationToastProps) => {

type useConfirmationToastProps<T> = {
    message: string | ((args: T) => string);
    messageProps?: TypographyProps;
    renderBody?: (args: T) => JSX.Element;
    confirmProps: ButtonProps & {
        handler: (args: T) => void;
        buttonText?: string;
    };
    cancelProps?: ButtonProps & {
        handler?: (args?: T) => void;
        buttonText?: string;
    };
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
};

export const useConfirmationToast = <T,>({
    message,
    messageProps,
    renderBody,
    confirmProps,
    cancelProps,
    position = 'top-right',
}: useConfirmationToastProps<T>) => {
    const { handler: confirmHandler, buttonText: confirmButtonText, ...confirmButtonProps } = confirmProps;
    const { handler: cancelHandler, buttonText: cancelButtonText, ...cancelButtonProps } = cancelProps || {};

    const toastId = 'confirmation-toast';

    const handleConfirmation = (args: T, cancelArgs?: T) => {
        const body = args && renderBody ? renderBody(args) : null;

        const handleConfirm = () => {
            confirmHandler(args);
            toast.dismiss(toastId);
        };

        const handleCancel = () => {
            if (cancelHandler) {
                cancelHandler(cancelArgs);
            }
            toast.dismiss(toastId);
        };

        const messageString = typeof message === 'string' ? message : message(args);

        const content = (
            <Stack
                direction="column"
                sx={{ height: '100%', width: '200', textAlign: 'center' }}
                spacing={2}
                alignItems="center">
                <Typography {...messageProps}>{messageString}</Typography>
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

        toast(content, {
            toastId, // Use the same ID
            type: 'info',
            icon: false,
            autoClose: false,
            position,
            closeButton: false,
            // closeButton: () => <CustomCloseButton onClose={handleCancel} />,
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
