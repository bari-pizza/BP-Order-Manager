import { OrderOrigin } from '../../typesAndValidators';
import { RoundLottieIcon } from '../../rickcedlib/LottieIcons';

type OriginLogoProps = { orderOrigin: OrderOrigin; playOnce?: boolean };

export const OriginLogo = ({ orderOrigin, playOnce }: OriginLogoProps) => {
    return (
        <RoundLottieIcon
            imageSrc={orderOrigin.icon || ''}
            height="25px"
            width="25px"
            className={`origin-logo-${orderOrigin.name}`}
            playOnce={playOnce}
        />
    );
};
