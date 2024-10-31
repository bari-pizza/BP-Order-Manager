import { OrderOrigin } from '../../typesAndValidators';
import { RoundImage, RoundImageProps } from '../Base/RoundImage';

type OriginLogoProps = Omit<RoundImageProps, 'src' | 'alt'> & { orderOrigin: OrderOrigin };

export const OriginLogo = ({ orderOrigin, ...props }: OriginLogoProps) => {
    return (
        <RoundImage
            src={orderOrigin.icon || ''}
            alt={orderOrigin.name}
            className={`origin-logo-${orderOrigin.name}`}
            {...props}
        />
    );
};
