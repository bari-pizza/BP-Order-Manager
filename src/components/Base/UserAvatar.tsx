import { useBariPizzaContext, useUserContext } from '../../hooks/data/useContextData';
import { RoundImage } from './RoundImage';
import type { Resource } from '../../typesAndValidators';

export const UserAvatar = () => {
    const { resources } = useBariPizzaContext();
    const { session, profile } = useUserContext();
    const missingAvatarSrc = resources.find((resource: Resource) => resource.title === 'Missing Avatar')?.src;

    if (profile) {
        const src = profile.avatar_src || missingAvatarSrc;
        return src ? <RoundImage src={src} alt="Your profile" size="medium" bump /> : null;
    }

    if (!session) {
        return missingAvatarSrc ? <RoundImage src={missingAvatarSrc} alt="" size="medium" bump /> : null;
    }

    return null;
};
