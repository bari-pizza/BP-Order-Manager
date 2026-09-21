import { describe, expect, it } from 'vitest';
import { UPLOAD_MAX_EDGE_PX } from '../../src/utils/compressImage';

describe('compressImageForUpload constants', () => {
    it('caps uploads near 2–4x the largest Resource/avatar UI size (~125px)', () => {
        expect(UPLOAD_MAX_EDGE_PX).toBeGreaterThanOrEqual(250);
        expect(UPLOAD_MAX_EDGE_PX).toBeLessThanOrEqual(1024);
    });
});
