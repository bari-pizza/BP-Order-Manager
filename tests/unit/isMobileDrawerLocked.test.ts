import { describe, expect, it } from 'vitest';
import { isMobileDrawerLocked } from '../../src/pages/Orders/isMobileDrawerLocked';

describe('isMobileDrawerLocked', () => {
    it('is locked when summary says so even with unlocked orders', () => {
        expect(isMobileDrawerLocked({ is_locked: true }, [{ is_locked: false }])).toBe(true);
    });

    it('is locked when every order is locked even if summary is missing/stale', () => {
        expect(isMobileDrawerLocked(null, [{ is_locked: true }, { is_locked: true }])).toBe(true);
        expect(isMobileDrawerLocked({ is_locked: false }, [{ is_locked: true }])).toBe(true);
    });

    it('is open when summary unlocked and any order unlocked', () => {
        expect(isMobileDrawerLocked({ is_locked: false }, [{ is_locked: true }, { is_locked: false }])).toBe(false);
        expect(isMobileDrawerLocked(undefined, [])).toBe(false);
        expect(isMobileDrawerLocked(null, [{ is_locked: false }])).toBe(false);
    });
});
