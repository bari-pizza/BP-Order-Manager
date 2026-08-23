import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { RoundLottieIcon } from '../../rickcedlib/LottieIcons';
import type { Resource } from '../../typesAndValidators';

type ProfileAvatarProps = {
    avatarSrc?: string | null;
    size?: number;
};

/** Small round avatar for tables/lists (uses Missing Avatar resource when empty). */
export const ProfileAvatar = ({ avatarSrc, size = 36 }: ProfileAvatarProps) => {
    const { resources } = useBariPizzaContext();
    const missing = resources.find((resource: Resource) => resource.title === 'Missing Avatar');
    const imageSrc = avatarSrc || missing?.src || '';

    const px = `${size}px`;
    return <RoundLottieIcon imageSrc={imageSrc} height={px} width={px} />;
};
