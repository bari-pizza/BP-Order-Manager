import { QueryClient } from '@tanstack/react-query';

const rosterKeys = [['drivers'], ['profiles'], ['drawers']] as const;

/**
 * Refetch driver roster, drawers, and employee profiles after a role change or auth event.
 * Drawers are included because marking someone a driver creates a matching Drawer row.
 */
export const invalidateDriversAndProfiles = (queryClient: QueryClient) =>
    Promise.all(rosterKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey: [...queryKey] })));

/** Drop roster caches on sign-out so the next sign-in cannot reuse a stale 30min drivers list. */
export const clearDriversAndProfiles = (queryClient: QueryClient) => {
    for (const queryKey of rosterKeys) {
        queryClient.removeQueries({ queryKey: [...queryKey] });
    }
};
