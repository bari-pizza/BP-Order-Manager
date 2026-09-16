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
    return <RoundImage src={imageSrc} alt="" style={{ height: px, width: px, flexShrink: 0 }} />;
};
