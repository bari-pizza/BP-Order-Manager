import { useCallback, useState } from 'react';

const defaultOptions = {
    onClose: () => {},
    onOpen: () => {},
};

interface OptionsProps {
    onClose?: () => void;
    onOpen?: () => void;
}

export const useDialogProps = (options?: OptionsProps) => {
    const [open, setOpen] = useState(false);

    const onClose = options?.onClose || defaultOptions.onClose;
    const onOpen = options?.onOpen || defaultOptions.onOpen;
    const closeDialog = useCallback(() => {
        onClose();
        setOpen(false);
    }, [onClose]);
    const openDialog = useCallback(() => {
        onOpen();
        setOpen(true);
    }, [onOpen]);
    return { open: openDialog, close: closeDialog, isOpen: open };
};
