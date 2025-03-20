import { Tooltip } from '@mui/material';
import { PaymentType } from '../../typesAndValidators';
import { CashLottieIcon, CreditCardLottieIcon, ThirdPartyLottieIcon } from '../../rickcedlib/LottieIcons';

export const PaymentTypeIcon = ({ paymentType }: { paymentType?: PaymentType }) => {
    if (!paymentType) return null;
    let icon = <CashLottieIcon />;
    if (paymentType === 'card') {
        icon = <CreditCardLottieIcon />;
    } else if (paymentType === 'third_party') {
        icon = <ThirdPartyLottieIcon />;
    }
    return (
        <Tooltip
            title={paymentType.split('_').join(' ')}
            slotProps={{ tooltip: { sx: { textTransform: 'capitalize' } } }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>
        </Tooltip>
    );
};
