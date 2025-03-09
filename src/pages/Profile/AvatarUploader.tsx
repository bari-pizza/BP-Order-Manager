import { useUploadToast } from '../../hooks/upload/useUploadToast';
import { BucketName, Profile } from '../../typesAndValidators';
import { ImageUploader } from '../../components/Base/Uploader/ImageUploader';
import { useProfileCRUD } from '../../api/profile';

type AvatarUploaderProps = {
    profile: Profile | null;
    onUpload?: () => void;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
};

export const AvatarUploader = ({ profile, onUpload, onSuccess, onError, disabled }: AvatarUploaderProps) => {
    const { profileMutations } = useProfileCRUD({ queryKey: ['profile'] });
    const { startToast, successToast, errorToast } = useUploadToast({
        messages: {
            onUpload: () => 'Uploading new avatar...',
            onSuccess: () => 'Avatar uploaded successfully',
            onError: () => 'Failed to upload avatar',
        },
    });

    const handleUpload = () => {
        onUpload?.();
        startToast();
    };

    const handleSuccess = (downloadURL: string) => {
        onSuccess?.(downloadURL);
        successToast(downloadURL);
        const payload = { ...profile!, avatar_src: downloadURL };
        profileMutations.update(payload);
    };

    const handleError = (error: Error) => {
        onError?.(error);
        errorToast(error);
    };

    const imageUploaderProps = {
        onUpload: handleUpload,
        onSuccess: handleSuccess,
        onError: handleError,
        bucketName: 'avatars' as BucketName,
        basePath: profile?.id || '',
        fileName: 'avatar',
        originalURL: profile?.avatar_src || 'src/assets/add-user.png',
        imgProps: {
            width: 125,
            height: 125,
        },
    };

    // TODO: Add a frame around the avatar
    // [ ] tooltip?
    // [ ] edit icon on hover/mobile

    return <ImageUploader {...imageUploaderProps} disabled={disabled} size="xlarge" />;
};
