// TODO: create a toast.confirmation wrapper - should have an onConfirm function

import { Button, ButtonProps, Stack, Typography, TypographyProps } from '@mui/material';
import { capitalizeFirstWord } from '../utils';
import { toast } from '../toast/toastWrapper';

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
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';
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

        const messageString = capitalizeFirstWord(typeof message === 'string' ? message : message(args));

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

        let toastPosition = position;
        let className: string | undefined;

        if (toastPosition === 'center') {
            toastPosition = 'top-center';
            className = 'Toastify__toast-container--center';
        }

        const toastOptions = {
            toastId,
            type: 'info' as const,
            icon: false as const,
            autoClose: false as const,
            position: toastPosition,
            closeButton: false as const,
            className,
        };

        if (toast.isActive(toastId)) {
            toast.update(toastId, { render: content, ...toastOptions });
        } else {
            toast.show(content, toastOptions);
        }
    };

    return { handleConfirmation };
};
