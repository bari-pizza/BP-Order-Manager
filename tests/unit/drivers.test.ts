import { describe, expect, it } from 'vitest';
import { isDriverWorkingToday } from '../../src/utils/drivers';

describe('isDriverWorkingToday', () => {
    it('is true when this drawer is on today’s roster', () => {
        expect(
            isDriverWorkingToday([{ drawer_id: 'a' }, { drawer_id: 'mine' }], 'mine'),
        ).toBe(true);
    });

    it('is false when only other drawers are assigned', () => {
        expect(isDriverWorkingToday([{ drawer_id: 'a' }, { drawer_id: 'b' }], 'mine')).toBe(false);
    });

    it('is false when nobody is assigned', () => {
        expect(isDriverWorkingToday([], 'mine')).toBe(false);
    });
});
