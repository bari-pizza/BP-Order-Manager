import { useUploadToast } from '../../hooks/upload/useUploadToast';
import { BucketName, Resource } from '../../typesAndValidators';
import { ImageUploader } from '../../components/Base/Uploader/ImageUploader';
import { useResourceCRUD } from '../../api/resource';

type ResourceUploaderProps = {
    resource: Resource;
    onUpload?: () => void;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
};

export const ResourceUploader = ({ resource, onUpload, onSuccess, onError, disabled }: ResourceUploaderProps) => {
    const { resourceMutations } = useResourceCRUD({ queryKey: ['resources'] });
    const { startToast, successToast, errorToast } = useUploadToast({
        messages: {
            onUpload: () => 'Uploading new icon...',
            onSuccess: () => 'Icon uploaded successfully',
            onError: () => 'Failed to upload icon',
        },
    });

    const handleUpload = () => {
        onUpload?.();
        startToast();
    };

    const handleSuccess = (downloadURL: string) => {
        onSuccess?.(downloadURL);
        successToast(downloadURL);
        resourceMutations.update({ ...resource, src: downloadURL });
    };

    const handleError = (error: Error) => {
        onError?.(error);
        errorToast(error);
    };

    const imageUploaderProps = {
        onUpload: handleUpload,
        onSuccess: handleSuccess,
        onError: handleError,
        bucketName: 'resources' as BucketName,
        basePath: resource.title,
        fileName: 'src',
        originalURL: resource.src || '',
        // imgProps: {
        //     width: 125,
        //     height: 125,
        // },
    };

    return <ImageUploader {...imageUploaderProps} disabled={disabled} size="medium" />;
};
