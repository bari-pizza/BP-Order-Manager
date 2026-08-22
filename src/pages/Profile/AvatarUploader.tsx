import { useQueryClient } from '@tanstack/react-query';
import { useUploadToast } from '../../hooks/upload/useUploadToast';
import { BucketName, Profile } from '../../typesAndValidators';
import { ImageUploader } from '../../components/Base/Uploader/ImageUploader';
import { supaClient } from '../../supaClient';

type AvatarUploaderProps = {
    profile: Profile | null;
    onUpload?: () => void;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
};

export const AvatarUploader = ({ profile, onUpload, onSuccess, onError, disabled }: AvatarUploaderProps) => {
    const queryClient = useQueryClient();
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

    const handleSuccess = async (downloadURL: string) => {
        if (!profile?.id) {
            const error = new Error('No profile to attach this avatar to');
            onError?.(error);
            errorToast(error);
            return;
        }

        const { data, error } = await supaClient
            .from('Profile')
            .update({ avatar_src: downloadURL })
            .eq('id', profile.id)
            .select('id');

        if (error || !data?.length) {
            const saveError = error ?? new Error('Profile update did not save');
            onError?.(saveError);
            errorToast(saveError);
            return;
        }

        queryClient.setQueryData(['profiles'], (current: Profile[] | undefined) =>
            current?.map((row) => (row.id === profile.id ? { ...row, avatar_src: downloadURL } : row)),
        );
        await queryClient.invalidateQueries({ queryKey: ['profiles'] });
        onSuccess?.(downloadURL);
        successToast(downloadURL);
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

    return <ImageUploader {...imageUploaderProps} disabled={disabled} size="xlarge" />;
};
