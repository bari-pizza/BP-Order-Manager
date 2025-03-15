import { OrderOrigin } from '../../typesAndValidators';
// import { RoundImage, RoundImageProps } from '../Base/RoundImage';
import { RoundLottieIcon } from '../../rickcedlib/LottieIcons';

// type OriginLogoProps = Omit<RoundImageProps, 'src' | 'alt'> & { orderOrigin: OrderOrigin };
type OriginLogoProps = { orderOrigin: OrderOrigin };

export const OriginLogo = ({ orderOrigin }: OriginLogoProps) => {
    return (
        // <RoundImage
        //     src={orderOrigin.icon || ''}
        //     alt={orderOrigin.name}
        //     className={`origin-logo-${orderOrigin.name}`}
        //     {...props}
        // />
        <RoundLottieIcon imageSrc={orderOrigin.icon || ''} height="25px" width="25px" />
    );
};
