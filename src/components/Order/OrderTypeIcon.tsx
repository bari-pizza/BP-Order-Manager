import { Restaurant as PickupIcon } from '@mui/icons-material';
import { CarLottieIcon } from '../../rickcedlib/LottieIcons';

export const OrderTypeIcon = ({ orderType }: { orderType: string }) => {
    if (orderType === 'pickup') {
        return <PickupIcon className="order-type-pickup-icon" />;
    } else if (orderType === 'delivery') {
        return <CarLottieIcon className="order-type-delivery-icon" />;
    }
    return null;
};
