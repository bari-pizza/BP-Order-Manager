import { useUploadToast } from '../hooks/upload/useUploadToast';
import { BucketName, OrderOrigin } from '../typesAndValidators';
import { ImageUploader } from './Base/Uploader/ImageUploader';

type LogoUploaderProps = {
    origin: OrderOrigin;
    onUpload?: () => void;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
};

export const LogoUploader = ({ origin, onUpload, onSuccess, onError, disabled }: LogoUploaderProps) => {
    const { startToast, successToast, errorToast } = useUploadToast({
        messages: {
            onUpload: () => 'Uploading new logo...',
            onSuccess: () => "Logo uploaded successfully, don't forget to save your changes!",
            onError: () => 'Failed to upload logo',
        },
    });

    const handleUpload = () => {
        startToast();
        onUpload?.();
    };

    const handleSuccess = (downloadURL: string) => {
        successToast(downloadURL);
        onSuccess?.(downloadURL);
    };

    const handleError = (error: Error) => {
        errorToast(error);
        onError?.(error);
    };

    const imageUploaderProps = {
        onUpload: handleUpload,
        onSuccess: handleSuccess,
        onError: handleError,
        bucketName: 'order_origins' as BucketName,
        basePath: origin.name,
        fileName: 'logo',
        originalURL: origin.icon || '',
    };

    return <ImageUploader {...imageUploaderProps} disabled={disabled} />;
};
