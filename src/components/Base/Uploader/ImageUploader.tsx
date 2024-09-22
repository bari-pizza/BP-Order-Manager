import { useRef } from 'react';
import { useImageUpload } from '../../../hooks/upload/useImageUpload';
import { BucketName } from '../../../typesAndValidators';
import { Stack } from '@mui/material';
import { RoundImage } from '../RoundImage';
export const ImageUploader = ({
    bucketName,
    basePath,
    fileName,
    onUpload,
    onError,
    onSuccess,
    originalURL,
    disabled,
    size,
    style,
}: {
    bucketName: BucketName;
    basePath: string;
    fileName?: string;
    originalURL?: string;
    onSuccess?: (downloadURL: string) => void;
    onError?: (error: Error) => void;
    onUpload?: () => void;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    style?: React.CSSProperties;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleFileChange, uploadedImagePath } = useImageUpload({
        bucketName,
        basePath,
        fileName,
        originalPath: originalURL?.split('/').pop(),
        onSuccess,
        onUpload,
        onError,
    });

    return (
        <Stack
            onClick={disabled ? undefined : () => inputRef.current?.click()}
            justifyContent="center"
            height="100%"
            sx={{ cursor: 'pointer' }}>
            <input type="file" onChange={handleFileChange} hidden ref={inputRef} />
            <RoundImage
                src={uploadedImagePath || originalURL || ''}
                alt="uploaded image"
                style={style}
                size={size}
                variant="border"
            />
        </Stack>
    );
};
