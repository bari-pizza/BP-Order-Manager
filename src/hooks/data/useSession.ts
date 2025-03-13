import { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { supaClient } from '../../supaClient';
import { Profile } from '../../typesAndValidators';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

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
    const profileLoading = profiles.length === 0;

    // Listen to auth changes
    useEffect(() => {
        const { data: listener } = supaClient.auth.onAuthStateChange((_event, newSession) => {
            queryClient.setQueryData(['session'], newSession);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [queryClient]);

    // if (profile?.is_deleted) {
    //     return { session: null, profile: null, loading: sessionLoading || profileLoading };
    // }

    return { session, profile, loading: sessionLoading || profileLoading };
};
