import { describe, expect, it } from 'vitest';
import { UPLOAD_MAX_EDGE_PX } from '../../src/utils/compressImage';

describe('compressImageForUpload constants', () => {
    it('defaults uploads to a 512px maximum edge', () => {
        expect(UPLOAD_MAX_EDGE_PX).toBe(512);
    });
});
