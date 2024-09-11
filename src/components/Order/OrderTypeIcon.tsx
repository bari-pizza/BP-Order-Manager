import { TwoWheeler as DeliveryIcon, Restaurant as PickupIcon } from '@mui/icons-material';

export const OrderTypeIcon = ({ orderType }: { orderType: string }) => {
    if (orderType === 'pickup') {
        return <PickupIcon />;
    } else if (orderType === 'delivery') {
        return <DeliveryIcon />;
    }
    return null;
};
