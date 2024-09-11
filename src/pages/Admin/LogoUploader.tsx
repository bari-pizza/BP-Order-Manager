import { useUploadToast } from '../../hooks/upload/useUploadToast';
import { BucketName, OrderOrigin } from '../../typesAndValidators';
import { ImageUploader } from '../../components/Base/Uploader/ImageUploader';
import { useOrderOriginCRUD } from '../../api/order_origin';

type LogoUploaderProps = {
    origin: OrderOrigin;
    onUpload?: () => void;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
};

export const LogoUploader = ({ origin, onUpload, onSuccess, onError, disabled }: LogoUploaderProps) => {
    const { orderOriginMutations } = useOrderOriginCRUD({ queryKey: ['profile'] });
    const { startToast, successToast, errorToast } = useUploadToast({
        messages: {
            onUpload: () => 'Uploading new logo...',
            onSuccess: () => 'Logo uploaded successfully',
            onError: () => 'Failed to upload logo',
        },
    });

    const handleUpload = () => {
        onUpload?.();
        startToast();
    };

    const handleSuccess = (downloadURL: string) => {
        onSuccess?.(downloadURL);
        successToast(downloadURL);
        orderOriginMutations.update({ ...origin, icon: downloadURL });
    };

    const handleError = (error: Error) => {
        onError?.(error);
        errorToast(error);
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

    return <ImageUploader {...imageUploaderProps} disabled={disabled} size="medium" />;
};
