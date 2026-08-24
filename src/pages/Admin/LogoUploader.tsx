import { useUploadToast } from '../../hooks/upload/useUploadToast';
import { BucketName, OrderOrigin } from '../../typesAndValidators';
import { ImageUploader } from '../../components/Base/Uploader/ImageUploader';
import { useOrderOriginCRUD } from '../../api/orderOrigin';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { DEFAULT_ORIGIN_RESOURCE_TITLE } from '../../constants/resources';

type LogoUploaderProps = {
    origin: OrderOrigin;
    onUpload?: () => void;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
    isAnimated?: boolean;
};

export const LogoUploader = ({ origin, onUpload, onSuccess, onError, disabled, isAnimated }: LogoUploaderProps) => {
    const { resources } = useBariPizzaContext();
    const defaultOriginLogo = resources.find((resource) => resource.title === DEFAULT_ORIGIN_RESOURCE_TITLE)?.src;
    const { orderOriginMutations } = useOrderOriginCRUD({ queryKey: ['order_origins'] });
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
        originalURL: origin.icon || defaultOriginLogo || '',
    };

    return <ImageUploader {...imageUploaderProps} disabled={disabled} size="medium" isAnimated={isAnimated} />;
};
