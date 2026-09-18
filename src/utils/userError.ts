type ErrorLike = {
    message?: string;
    code?: string;
    status?: number;
    name?: string;
};

const NETWORK_HINT = 'Check your connection and try again.';

/**
 * Turn auth / PostgREST / generic failures into a short toast-friendly message.
 * Only known, intentional messages reach the user — never raw backend diagnostics.
 */
export const formatUserError = (error: unknown, fallback = 'Something went wrong. Please try again.'): string => {
    if (error == null) return fallback;

    if (typeof error === 'string') {
        return mapKnownMessage(error) ?? fallback;
    }

    const err = error as ErrorLike;
    const message = (err.message || '').trim();
    const code = (err.code || '').toString();
    const status = err.status;

    if (isNetworkFailure(error, message)) {
        return `Unable to reach the server. ${NETWORK_HINT}`;
    }

    // Supabase Auth
    if (/invalid login credentials/i.test(message)) {
        return 'Incorrect email or password.';
    }
    if (/email not confirmed/i.test(message)) {
        return 'Confirm your email before signing in.';
    }
    if (/user already registered/i.test(message)) {
        return 'An account with that email already exists.';
    }

    // Postgres / PostgREST permission & RLS
    if (code === '42501' || status === 401 || status === 403 || /permission denied|row-level security|jwt/i.test(message)) {
        return "You don't have permission to do that.";
    }

    // Unique / conflict
    if (code === '23505' || status === 409 || /duplicate key|already exists/i.test(message)) {
        return 'That record already exists.';
    }

    return mapKnownMessage(message) ?? fallback;
};

/** Allowlist of intentional server / RPC messages safe to show (exact or patterned). */
const mapKnownMessage = (message: string): string | null => {
    if (!message) return null;
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
        return `Unable to reach the server. ${NETWORK_HINT}`;
    }
    if (/^Only admins can update employees$/i.test(message)) {
        return 'Only admins can update employees.';
    }
    if (/^Only admins can delete or restore employees$/i.test(message)) {
        return 'Only admins can delete or restore employees.';
    }
    if (/^No profile found for /i.test(message)) {
        return 'Employee profile not found.';
    }
    return null;
};

const isNetworkFailure = (error: unknown, message: string): boolean => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
    if (error instanceof TypeError && /fetch/i.test(message)) return true;
    return /failed to fetch|networkerror|load failed|network request failed/i.test(message);
};

/** Dev-only logging so production consoles stay quiet (BAR-6). */
export const logDevError = (context: string, error: unknown): void => {
    if (import.meta.env.DEV) {
        console.error(`[${context}]`, error);
    }
};
