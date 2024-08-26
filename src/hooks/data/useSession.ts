import { RealtimeChannel, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supaClient } from '../../supaClient';
import { Profile } from '../../typesAndValidators';

export interface SupashipUserInfo {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
}

// for the future
// https://dev.to/ankitjey/the-magic-of-react-query-and-supabase-1pom

export const useSession = (): SupashipUserInfo => {
    const [userInfo, setUserInfo] = useState<SupashipUserInfo>({
        profile: null,
        session: null,
        loading: true,
    });
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    useEffect(() => {
        supaClient.auth.getSession().then(({ data: { session } }) => {
            setUserInfo((userInfo) => ({ ...userInfo, session, loading: false }));
            supaClient.auth.onAuthStateChange((_event, session) => {
                setUserInfo({ session, profile: null, loading: false });
            });
        });
    }, []);

    useEffect(() => {
        async function listenToUserProfileChanges(userId: string) {
            const { data } = await supaClient.from('Profile').select('*').filter('id', 'eq', userId);
            if (data?.[0]) {
                setUserInfo({ ...userInfo, profile: data?.[0] });
            }
            return supaClient
                .channel(`public:Profile`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${userId}`,
                    },
                    (payload) => {
                        setUserInfo({ ...userInfo, profile: payload.new as Profile });
                    },
                )
                .subscribe();
        }

        if (userInfo.session?.user && !userInfo.profile) {
            listenToUserProfileChanges(userInfo.session.user.id).then((newChannel) => {
                if (channel) {
                    channel.unsubscribe();
                }
                setChannel(newChannel);
            });
        } else if (!userInfo.session?.user) {
            channel?.unsubscribe();
            setChannel(null);
        }
    }, [channel, userInfo]);

    return userInfo;
};
