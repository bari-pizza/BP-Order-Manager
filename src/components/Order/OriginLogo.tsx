import { OrderOrigin } from '../../typesAndValidators';
import { RoundLottieIcon } from '../../rickcedlib/LottieIcons';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { IN_HOUSE_ORIGIN_RESOURCE_TITLE } from '../../constants/resources';

type OriginLogoProps = { orderOrigin: OrderOrigin; playOnce?: boolean };

export const OriginLogo = ({ orderOrigin, playOnce }: OriginLogoProps) => {
    const { resources } = useBariPizzaContext();
    const inHouseLogo = resources.find((resource) => resource.title === IN_HOUSE_ORIGIN_RESOURCE_TITLE)?.src;
    const imageSrc = orderOrigin.is_third_party
        ? orderOrigin.icon || ''
        : inHouseLogo || orderOrigin.icon || '';

    return (
        <RoundLottieIcon
            imageSrc={imageSrc}
            height="25px"
            width="25px"
            className={`origin-logo-${orderOrigin.name}`}
            playOnce={playOnce}
        />
    );
};
