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

    it('maps allowlisted RPC messages', () => {
        expect(formatUserError({ message: 'Only admins can update employees' })).toBe(
            'Only admins can update employees.',
        );
        expect(formatUserError({ message: 'Only admins can delete or restore employees' })).toBe(
            'Only admins can delete or restore employees.',
        );
        expect(formatUserError({ message: 'No profile found for abc-123' })).toBe('Employee profile not found.');
    });

    it('does not pass through unknown strings or server messages', () => {
        expect(formatUserError('SELECT * FROM secrets', 'Could not save.')).toBe('Could not save.');
        expect(formatUserError({ message: 'relation "secret_table" does not exist' }, 'Could not save.')).toBe(
            'Could not save.',
        );
    });

    it('uses fallback when empty', () => {
        expect(formatUserError(null, 'Could not save.')).toBe('Could not save.');
    });
});
