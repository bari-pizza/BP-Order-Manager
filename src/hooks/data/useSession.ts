import { Session } from '@supabase/supabase-js';
import { useEffect, useSyncExternalStore } from 'react';
import { supaClient } from '../../supaClient';
import { Profile } from '../../typesAndValidators';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { clearDriversAndProfiles, invalidateDriversAndProfiles } from '../../utils/queryInvalidation';
import { touchLastActiveAt } from '../../utils/touchLastActiveAt';

export interface SupashipUserInfo {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
}

// for the future
// https://dev.to/ankitjey/the-magic-of-react-query-and-supabase-1pom

const EMPTY_PROFILES: Profile[] = [];

const subscribeProfiles = (queryClient: ReturnType<typeof useQueryClient>, onChange: () => void) =>
    queryClient.getQueryCache().subscribe((event) => {
        if (event?.query.queryKey[0] === 'profiles') {
            onChange();
        }
    });

const getProfilesSnapshot = (queryClient: ReturnType<typeof useQueryClient>) =>
    (queryClient.getQueryData(['profiles']) as Profile[] | undefined) ?? EMPTY_PROFILES;

export const useSession = (): SupashipUserInfo => {
    const queryClient = useQueryClient();

    // Fetch session
    const { data: session, isLoading: sessionLoading } = useSuspenseQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const { data } = await supaClient.auth.getSession();
            return data.session;
        },
    });

    // Subscribe to the ['profiles'] cache AuthenticatedShopData fills. Plain getQueryData
    // does not re-render Layout when that query resolves, so Admin/Manager nav and /manager
    // stayed stuck after sign-in. Avoid a second useQuery here — it raced the suspense fetch
    // and remounted the order editor mid-interaction.
    const profiles = useSyncExternalStore(
        (onChange) => subscribeProfiles(queryClient, onChange),
        () => getProfilesSnapshot(queryClient),
        () => EMPTY_PROFILES,
    );

    const profile = profiles.find((p) => p.id === session?.user?.id) || null;
    // Profiles are only fetched after sign-in (see AuthenticatedShopData). Signed-out must not
    // look "loading" forever just because the cache is empty — that used to force anon reads on /login.
    const profileLoading = Boolean(session) && profiles.length === 0;

    // Listen to auth changes
    useEffect(() => {
        const { data: listener } = supaClient.auth.onAuthStateChange((event, newSession) => {
            queryClient.setQueryData(['session'], newSession);
            // PWA / SPA: sign-out must drop the 30min drivers cache; sign-in and cold start
            // (INITIAL_SESSION) must refetch so a newly marked driver is not "not found".
            if (event === 'SIGNED_OUT') {
                clearDriversAndProfiles(queryClient);
            } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                touchLastActiveAt(newSession?.user?.id);
                void invalidateDriversAndProfiles(queryClient);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [queryClient]);

    useEffect(() => {
        if (profile?.is_deleted) {
            supaClient.auth.signOut();
            queryClient.setQueryData(['session'], null);
        }
    }, [profile, queryClient]);

    return { session, profile, loading: sessionLoading || profileLoading };
};
