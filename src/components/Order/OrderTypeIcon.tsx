import { Restaurant as PickupIcon } from '@mui/icons-material';
import { CarLottieIcon } from '../../rickcedlib/LottieIcons';

export const OrderTypeIcon = ({ orderType }: { orderType: string }) => {
    if (orderType === 'pickup') {
        return <PickupIcon />;
    } else if (orderType === 'delivery') {
        return <CarLottieIcon />;
    }
    return null;
};
