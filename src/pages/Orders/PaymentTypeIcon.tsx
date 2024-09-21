import { Tooltip } from '@mui/material';
import { PaymentType } from '../../typesAndValidators';
import { Money as CashIcon, CreditCard as CardIcon, AccountBalanceWallet as ThirdPartyIcon } from '@mui/icons-material';

export const PaymentTypeIcon = ({ paymentType }: { paymentType?: PaymentType }) => {
    if (!paymentType) return null;
    let icon = <CashIcon />;
    if (paymentType === 'card') {
        icon = <CardIcon />;
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
