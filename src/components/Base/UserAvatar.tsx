import { useBariPizzaContext, useUserContext } from '../../hooks/data/useContextData';
import { RoundLottieIcon } from '../../rickcedlib/LottieIcons';
import type { Resource } from '../../types/types';

export const UserAvatar = () => {
    const { resources } = useBariPizzaContext();
    const { session, profile } = useUserContext();
    if (profile) {
        if (profile.avatar_src) {
            return <RoundLottieIcon imageSrc={profile.avatar_src} />;
        }
        const resource = resources.find((resource: Resource) => resource.title === 'Missing Avatar');
        if (resource) {
            return <RoundLottieIcon imageSrc={resource.src!} />;
        }
        return null;
    }

    if (!session) {
        return <RoundLottieIcon imageSrc="" />;
    }
};
