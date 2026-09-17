import { OrderOrigin } from '../../typesAndValidators';
import { RoundImage } from '../Base/RoundImage';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { DEFAULT_ORIGIN_RESOURCE_TITLE, IN_HOUSE_ORIGIN_RESOURCE_TITLE } from '../../constants/resources';

type OriginLogoProps = { orderOrigin: OrderOrigin };

/** Origin logos are identity, not feedback, so they never animate. */
export const OriginLogo = ({ orderOrigin }: OriginLogoProps) => {
    const { resources } = useBariPizzaContext();
    const inHouseLogo = resources.find((resource) => resource.title === IN_HOUSE_ORIGIN_RESOURCE_TITLE)?.src;
    const defaultOriginLogo = resources.find((resource) => resource.title === DEFAULT_ORIGIN_RESOURCE_TITLE)?.src;
    const imageSrc = orderOrigin.is_third_party
        ? orderOrigin.icon || defaultOriginLogo || ''
        : inHouseLogo || orderOrigin.icon || defaultOriginLogo || '';

    return (
        <RoundImage
            src={imageSrc}
            alt={orderOrigin.name}
            className={`origin-logo-${orderOrigin.name}`}
            // The ring used to be painted into the Lottie artwork; it's a real border now.
            variant="border"
            style={{ height: '25px', width: '25px', borderWidth: '2px', flexShrink: 0 }}
        />
    );
};
