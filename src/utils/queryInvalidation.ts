import { QueryClient } from '@tanstack/react-query';

/** Refetch driver roster and employee profiles (e.g. after role change or login). */
export const invalidateDriversAndProfiles = (queryClient: QueryClient) =>
    Promise.all([
        queryClient.invalidateQueries({ queryKey: ['drivers'] }),
        queryClient.invalidateQueries({ queryKey: ['profiles'] }),
    ]);
