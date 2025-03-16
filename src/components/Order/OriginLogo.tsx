import { OrderOrigin } from '../../typesAndValidators';
import { RoundLottieIcon } from '../../rickcedlib/LottieIcons';

type OriginLogoProps = { orderOrigin: OrderOrigin };

export const OriginLogo = ({ orderOrigin }: OriginLogoProps) => {
    return (
        <RoundLottieIcon
            imageSrc={orderOrigin.icon || ''}
            height="25px"
            width="25px"
            className={`origin-logo-${orderOrigin.name}`}
        />
    );
};
