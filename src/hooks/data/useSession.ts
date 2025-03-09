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

// TODO: would be better if we could use queryClient for this

export const useSession = (): SupashipUserInfo => {
    // const [userInfo, setUserInfo] = useState<SupashipUserInfo>({
    //     profile: null,
    //     session: null,
    //     loading: true,
    // });
    // const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    // useEffect(() => {
    //     supaClient.auth.getSession().then(({ data: { session } }) => {
    //         setUserInfo((userInfo) => ({ ...userInfo, session, loading: true }));
    //         supaClient.auth.onAuthStateChange((_event, session) => {
    //             setUserInfo({ session, profile: null, loading: false });
    //         });
    //     });
    // }, []);

    // useEffect(() => {
    //     async function listenToUserProfileChanges(userId: string) {
    //         const { data } = await supaClient.from('Profile').select('*').filter('id', 'eq', userId);
    //         if (data?.[0]) {
    //             setUserInfo({ ...userInfo, profile: data?.[0], loading: false });
    //         }
    //         return supaClient
    //             .channel(`public:Profile`)
    //             .on(
    //                 'postgres_changes',
    //                 {
    //                     event: '*',
    //                     schema: 'public',
    //                     table: 'Profile',
    //                     filter: `id=eq.${userId}`,
    //                 },
    //                 (payload) => {
    //                     setUserInfo({ ...userInfo, profile: payload.new as Profile, loading: false });
    //                 },
    //             )
    //             .subscribe();
    //     }

    //     if (userInfo.session?.user && !userInfo.profile) {
    //         listenToUserProfileChanges(userInfo.session.user.id).then((newChannel) => {
    //             if (channel) {
    //                 channel.unsubscribe();
    //             }
    //             setChannel(newChannel);
    //         });
    //     } else if (!userInfo.session?.user) {
    //         channel?.unsubscribe();
    //         setChannel(null);
    //     }
    // }, [channel, userInfo]);

    // return userInfo;
    const queryClient = useQueryClient();

    // Fetch session
    const { data: session, isLoading: sessionLoading } = useSuspenseQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const { data } = await supaClient.auth.getSession();
            return data.session;
        },
    });

    // Fetch profile if session exists
    // const { data: profile, isLoading: profileLoading } = useQuery({
    //     queryKey: ["profile", session?.user?.id],
    //     queryFn: async () => {
    //         if (!session?.user) return null;
    //         const { data } = await supaClient.from("Profile").select("*").eq("id", session.user.id).single();
    //         return data;
    //     },
    //     enabled: !!session?.user, // Only run if session exists
    // });

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

    // Listen to profile changes via Supabase Realtime
    // useEffect(() => {
    //     if (!session?.user) return;

    //     const channel = supaClient
    //         .channel(`public:Profile`)
    //         .on(
    //             'postgres_changes',
    //             {
    //                 event: '*',
    //                 schema: 'public',
    //                 table: 'Profile',
    //                 filter: `id=eq.${session.user.id}`,
    //             },
    //             (payload) => {
    //                 queryClient.setQueryData(['profile', session.user.id], payload.new);
    //             },
    //         )
    //         .subscribe();

    //     return () => {
    //         channel.unsubscribe();
    //     };
    // }, [session, queryClient]);

    return { session, profile, loading: sessionLoading || profileLoading };
};
