/** Largest Resource/avatar UI size is ~125px; 512 covers 2–4x DPR without shipping megabyte PNGs. */
export const UPLOAD_MAX_EDGE_PX = 512;

const SKIP_TYPES = new Set(['image/gif', 'image/svg+xml']);

/**
 * Downscale oversized images before Storage upload.
 * Returns the original file when already small enough or when canvas compression fails.
 */
export const compressImageForUpload = async (
    file: File,
    maxEdge = UPLOAD_MAX_EDGE_PX,
): Promise<File> => {
    if (!file.type.startsWith('image/') || SKIP_TYPES.has(file.type)) {
        return file;
    }

    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        return file;
    }

    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, maxEdge / longest);
    // Already within size budget and under ~150KB — skip re-encode
    if (scale >= 1 && file.size <= 150_000) {
        bitmap.close();
        return file;
    }

    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        bitmap.close();
        return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/webp', 0.82);
    });
    if (!blob || blob.size === 0) {
        return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() });
};
