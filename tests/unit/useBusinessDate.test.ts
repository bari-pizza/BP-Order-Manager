import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import { parseBusinessDateParam } from '../../src/hooks/data/businessDate';

describe('parseBusinessDateParam', () => {
    const today = dayjs('2026-09-19T15:30:00');

    it('accepts today and past calendar days', () => {
        expect(parseBusinessDateParam('2026-09-19', today)?.format('YYYY-MM-DD')).toBe('2026-09-19');
        expect(parseBusinessDateParam('2026-09-18', today)?.format('YYYY-MM-DD')).toBe('2026-09-18');
    });

    it('rejects future calendar days (stale module-load today would wrongly reject real today)', () => {
        expect(parseBusinessDateParam('2026-09-20', today)).toBeNull();
    });

    it('rejects invalid strings and null', () => {
        expect(parseBusinessDateParam('not-a-date', today)).toBeNull();
        expect(parseBusinessDateParam('2026-13-40', today)).toBeNull();
        expect(parseBusinessDateParam(null, today)).toBeNull();
    });

    it('uses calendar-day comparison so evening “today” still accepts YYYY-MM-DD today', () => {
        const late = dayjs('2026-09-19T23:59:59');
        expect(parseBusinessDateParam('2026-09-19', late)?.isSame(late, 'day')).toBe(true);
    });
});
