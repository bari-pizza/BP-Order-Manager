import { useState } from 'react';
import { supaClient } from '../../supaClient';
import { BucketName } from '../../typesAndValidators';

type UseImageUploadProps = {
    bucketName: BucketName;
    basePath: string;
    fileName?: string;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    onUpload?: () => void;
};
export const useImageUpload = ({
    bucketName,
    basePath,
    fileName,
    onUpload,
    onError,
    onSuccess,
}: UseImageUploadProps) => {
    const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);

    const uploadImage = async (file: File) => {
        if (onUpload) {
            onUpload();
        }

        if (!file) {
            throw new Error('No file selected');
        }

        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now().toString();
        const finalFileName = fileName ? `${fileName}.${fileExt}` : `${Math.random()}.${fileExt}`;
        const filePath = `${basePath}/${timestamp}/${finalFileName}`;

        try {
            const { error: uploadError } = await supaClient.storage.from(bucketName).upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            });

            if (uploadError) {
                throw uploadError;
            }

            const downloadURL = `https://vqsrmrwphnuitcxtoxqy.supabase.co/storage/v1/object/public/${bucketName}/${filePath}`;
            setUploadedImagePath(downloadURL);
            if (onSuccess) {
                onSuccess(downloadURL);
            }
        } catch (error: unknown) {
            if (onError) {
                onError(error as Error);
            }
        }
    };

    // Handles file input changes
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await uploadImage(file);
        }
    };

    return {
        uploadedImagePath,
        handleFileChange,
    };
};
