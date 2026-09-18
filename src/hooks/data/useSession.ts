import { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { supaClient } from '../../supaClient';
import { Profile } from '../../typesAndValidators';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { clearDriversAndProfiles, invalidateDriversAndProfiles } from '../../utils/queryInvalidation';

export interface SupashipUserInfo {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
}

// for the future
// https://dev.to/ankitjey/the-magic-of-react-query-and-supabase-1pom

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

    const profiles = (queryClient.getQueryData(['profiles']) || []) as Profile[];

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
