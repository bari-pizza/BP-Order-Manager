type ErrorLike = {
    message?: string;
    code?: string;
    status?: number;
    name?: string;
};

const NETWORK_HINT = 'Check your connection and try again.';

/**
 * Turn auth / PostgREST / generic failures into a short toast-friendly message.
 * Prefer actionable text over raw stack dumps; keep the server message when it's useful.
 */
export const formatUserError = (error: unknown, fallback = 'Something went wrong. Please try again.'): string => {
    if (error == null) return fallback;

    if (typeof error === 'string') {
        return mapKnownMessage(error) || error || fallback;
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

    const mapped = mapKnownMessage(message);
    if (mapped) return mapped;

    // Prefer a clean server message when present (employee RPC raises these intentionally).
    if (message && message.length < 200 && !/^\s*Error:/.test(message)) {
        return message;
    }

    return fallback;
};

const mapKnownMessage = (message: string): string | null => {
    if (!message) return null;
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
        return `Unable to reach the server. ${NETWORK_HINT}`;
    }
    if (/only admins can update employees/i.test(message)) {
        return 'Only admins can update employees.';
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
