import { describe, expect, it } from 'vitest';
import { formatUserError } from '../../src/utils/userError';

describe('formatUserError', () => {
    it('maps invalid login credentials', () => {
        expect(formatUserError({ message: 'Invalid login credentials' })).toBe('Incorrect email or password.');
    });

    it('maps permission / RLS failures', () => {
        expect(formatUserError({ message: 'permission denied', code: '42501' })).toBe(
            "You don't have permission to do that.",
        );
        expect(formatUserError({ message: 'new row violates row-level security policy' })).toBe(
            "You don't have permission to do that.",
        );
    });

    it('maps network failures', () => {
        expect(formatUserError({ message: 'Failed to fetch' })).toMatch(/Unable to reach the server/);
        expect(formatUserError(new TypeError('Failed to fetch'))).toMatch(/Unable to reach the server/);
    });

    it('keeps useful RPC messages', () => {
        expect(formatUserError({ message: 'Only admins can update employees' })).toBe(
            'Only admins can update employees.',
        );
    });

    it('uses fallback when empty', () => {
        expect(formatUserError(null, 'Could not save.')).toBe('Could not save.');
    });
});
