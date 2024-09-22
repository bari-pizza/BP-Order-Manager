import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

type UseUploadToastProps = {
    messages: {
        onUpload?: () => string;
        onSuccess?: (downloadURL: string) => string;
        onError?: (error: Error) => string;
    };
};

export const useUploadToast = ({ messages }: UseUploadToastProps) => {
    const toastRef = useRef<Id>('');
    const startToast = () => {
        toastRef.current = toast.loading(messages?.onUpload || 'Uploading...');
    };

    const successToast = (downloadURL: string) => {
        toast.update(toastRef.current, {
            render: messages?.onSuccess?.(downloadURL) || 'Upload successful',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
        });
    };

    const errorToast = (error: Error) => {
        toast.update(toastRef.current, {
            render: messages?.onError?.(error) || 'Upload failed',
            type: 'error',
            isLoading: false,
            autoClose: 2000,
        });
    };

    return { startToast, successToast, errorToast };
};
