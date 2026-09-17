import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { RoundImage } from './RoundImage';
import type { Resource } from '../../typesAndValidators';

type ProfileAvatarProps = {
    avatarSrc?: string | null;
    size?: number;
};

/** Small round avatar for tables/lists (uses Missing Avatar resource when empty). Static by design. */
export const ProfileAvatar = ({ avatarSrc, size = 32 }: ProfileAvatarProps) => {
    const { resources } = useBariPizzaContext();
    const missing = resources.find((resource: Resource) => resource.title === 'Missing Avatar');
    const imageSrc = avatarSrc || missing?.src || '';

    const px = `${size}px`;
    return (
        <RoundImage
            src={imageSrc}
            alt=""
            // The ring used to be painted into the Lottie artwork; it's a real border now.
            variant="border"
            style={{ height: px, width: px, borderWidth: '2px', flexShrink: 0 }}
        />
    );
};
