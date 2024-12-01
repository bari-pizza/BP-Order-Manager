import { Tooltip } from '@mui/material';
import { PaymentType } from '../../typesAndValidators';
import { Money as CashIcon } from '@mui/icons-material';
import { CreditCardLottieIcon, ThirdPartyLottieIcon } from '../../rickcedlib/LottieIcons';

export const PaymentTypeIcon = ({ paymentType }: { paymentType?: PaymentType }) => {
    if (!paymentType) return null;
    let icon = <CashIcon />;
    // TODO: replace with lottie icon
    if (paymentType === 'card') {
        icon = <CreditCardLottieIcon />;
    } else if (paymentType === 'third_party') {
        icon = <ThirdPartyLottieIcon />;
    }
    return (
        <Tooltip
            title={paymentType.split('_').join(' ')}
            slotProps={{ tooltip: { sx: { textTransform: 'capitalize' } } }}>
            {icon}
        </Tooltip>
    );
};
