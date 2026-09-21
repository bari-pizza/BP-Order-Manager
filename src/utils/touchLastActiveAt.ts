import { supaClient } from '../supaClient';
import { logDevError } from './userError';

/** Min gap between writes for the same user (avoids spam on remount / double SIGNED_IN). */
const THROTTLE_MS = 15 * 60 * 1000;

const lastWriteByUser = new Map<string, number>();

/**
 * Stamp Profile.last_active_at for the signed-in user.
 * Fire-and-forget; failures are logged only (login UX must not block on this).
 */
export const touchLastActiveAt = (userId: string | undefined | null): void => {
    if (!userId) return;

    const now = Date.now();
    const previous = lastWriteByUser.get(userId) ?? 0;
    if (now - previous < THROTTLE_MS) return;
    lastWriteByUser.set(userId, now);

    void (async () => {
        const { error } = await supaClient.rpc('touch_last_active_at');
        if (error) {
            logDevError('touchLastActiveAt', error);
            // Allow a retry on the next eligible event.
            lastWriteByUser.delete(userId);
        }
    })();
};
