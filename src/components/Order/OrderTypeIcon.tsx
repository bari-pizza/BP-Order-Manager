import { Restaurant as PickupIcon } from '@mui/icons-material';
import { LottieIcon } from '../../rickcedlib/LottieIcons/LottieIcon';
const carLottieSrc = new URL('/Car Icon.json', import.meta.url).href;

export const OrderTypeIcon = ({ orderType }: { orderType: string }) => {
    if (orderType === 'pickup') {
        return <PickupIcon />;
    } else if (orderType === 'delivery') {
        // return <DeliveryIcon />;
        return <LottieIcon lottieSrc={carLottieSrc} />;
    }
    return null;
};
