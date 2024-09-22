import { Tooltip } from '@mui/material';
import { PaymentType } from '../../typesAndValidators';
import { Money as CashIcon, AccountBalanceWallet as ThirdPartyIcon } from '@mui/icons-material';
import { LottieIcon } from '../../rickcedlib/LottieIcons/LottieIcon';
const cardLottieSrc = new URL('/Credit Card Icon.json', import.meta.url).href;

export const PaymentTypeIcon = ({ paymentType }: { paymentType?: PaymentType }) => {
    if (!paymentType) return null;
    let icon = <CashIcon />;
    if (paymentType === 'card') {
        icon = <LottieIcon lottieSrc={cardLottieSrc} />;
    } else if (paymentType === 'third_party') {
        icon = <ThirdPartyIcon />;
    }
    return (
        <Tooltip
            title={paymentType.split('_').join(' ')}
            slotProps={{ tooltip: { sx: { textTransform: 'capitalize' } } }}>
            {icon}
        </Tooltip>
    );
};
