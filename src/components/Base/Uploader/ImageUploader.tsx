import { useRef } from 'react';
import { useImageUpload } from '../../../hooks/upload/useImageUpload';
import { BucketName } from '../../../typesAndValidators';
import { Stack } from '@mui/material';
export const ImageUploader = ({
    bucketName,
    basePath,
    fileName,
    onUpload,
    onError,
    onSuccess,
    originalURL,
    disabled,
}: {
    bucketName: BucketName;
    basePath: string;
    fileName?: string;
    originalURL?: string;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    onUpload?: () => void;
    disabled?: boolean;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleFileChange, uploadedImagePath } = useImageUpload({
        bucketName,
        basePath,
        fileName,
        onSuccess,
        onUpload,
        onError,
    });

    console.log({ uploadedImagePath, originalURL });

    return (
        <Stack onClick={disabled ? undefined : () => inputRef.current?.click()} justifyContent="center" height="100%">
            <input type="file" onChange={handleFileChange} hidden ref={inputRef} />
            <img src={uploadedImagePath || originalURL} alt="uploaded image" width="35px" height="35px" />
        </Stack>
    );
};
