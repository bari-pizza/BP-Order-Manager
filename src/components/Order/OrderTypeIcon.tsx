import { CarLottieIcon, PickupLottieIcon } from '../../rickcedlib/LottieIcons';

export const OrderTypeIcon = ({ orderType }: { orderType: string }) => {
    if (orderType === 'pickup') {
        return <PickupLottieIcon className="order-type-pickup-icon" />;
    } else if (orderType === 'delivery') {
        return <CarLottieIcon className="order-type-delivery-icon" />;
    }
    return null;
};
