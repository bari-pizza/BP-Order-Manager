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
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    style?: React.CSSProperties;
};

export const ResourceUploader = ({
    resource,
    onUpload,
    onSuccess,
    onError,
    disabled,
    size = 'xlarge',
    style = { height: '6em', width: '6em' },
}: ResourceUploaderProps) => {
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
    };

    return (
        <ImageUploader {...imageUploaderProps} disabled={disabled} size={size} style={style} />
    );
};
