import { useRef } from 'react';
import { Card, Typography, CardActionArea, Skeleton, Stack, Divider } from '@mui/material';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import LocalPizzaRoundedIcon from '@mui/icons-material/LocalPizzaRounded';
import { Order_Payment } from '../../typesAndValidators';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { useDialogProps } from '../../hooks/ui/useDialogProps';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useBariPizzaContext, useLayoutContext, useOrderDashboardContext } from '../../hooks/data/useContextData';
import { OrderTypeIcon } from '../../components/Order/OrderTypeIcon';
import { OriginLogo } from '../../components/Order/OriginLogo';
import { PaymentTypeIcon } from './PaymentTypeIcon';
import { formatCurrency } from '../../utils';
import { LockLottieIcon } from '../../rickcedlib/LottieIcons';
import { useMobile } from '../../hooks/data/useMobile';

interface OrderTicketMobileProps {
    order: Order_Payment;
}

interface OrderTicketProps extends OrderTicketMobileProps {
    toggleSelected: (order: Order_Payment) => void;
    selected: boolean;
}

export const OrderTicket = ({ order, toggleSelected, selected }: OrderTicketProps) => {
    const { isMobile } = useLayoutContext();
    if (isMobile) {
        return <OrderTicketMobile order={order} />;
    } else {
        return <OrderTicketDesktop order={order} toggleSelected={toggleSelected} selected={selected} />;
    }
};

const OrderTicketMobile = ({ order }: OrderTicketMobileProps) => {
    const { driver } = useMobile();
    const { origins } = useBariPizzaContext();
    const { open, isOpen, close } = useDialogProps();

    const cardSX = {
        width: 225,
        position: 'relative',
        height: 105,
        transition: 'background-color 1s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    };

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        open();
    };

    const orderOrigin = origins.find((origin) => origin.origin_id === order.origin_id)!;

    const { payments } = order;

    const initialPayment = payments?.[0];

    const totalPayments = payments?.reduce((acc, payment) => acc + payment?.amount_in_cents || 0, 0);
    const totalTips = payments?.reduce((acc, payment) => acc + payment?.tip_in_cents || 0, 0);
    const isPaidValid = totalPayments === order.total_in_cents;
    const isLocked = order.is_locked;

    return (
        <Card variant="elevation" sx={cardSX} raised className="lottie-icon-container order-ticket">
            <CardActionArea onClick={handleEditClick}>
                <Stack direction="column">
                    <Stack direction="row" m={1} mb={0} justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" className={order.order_name ? 'order-name' : 'order-number'}>
                            {order.order_name ?? `Order #${order.order_number || 'N/A'}`}
                        </Typography>
                        <PaymentTypeIcon paymentType={initialPayment?.payment_type} />
                    </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" ml={1} mr={1} alignItems="center">
                    <OriginLogo orderOrigin={orderOrigin} />
                    <OrderTypeIcon orderType={order.order_type} />
                </Stack>
                <Stack direction="row" spacing={1} pl={1} pr={1} justifyContent="space-between">
                    <Typography variant="body1" color={isPaidValid ? 'primary' : 'error'} className="order-total">
                        {formatCurrency(order.total_in_cents)}
                    </Typography>
                    <Divider orientation="vertical" />
                    <Typography variant="body1" color={totalTips > 0 ? 'primary' : 'error'} className="order-tips">
                        {formatCurrency(totalTips)}
                    </Typography>
                </Stack>
            </CardActionArea>
            {isLocked && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        height: '100%',
                        width: '100%',
                        color: 'rgb(11 7 7 / 66%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <LockLottieIcon height="8em" width="8em" />
                </div>
            )}

            <OrderEditor order={order} asDialog close={close} isOpen={isOpen} driverDrawerID={driver?.drawer_id} />
        </Card>
    );
};

const OrderTicketDesktop = ({ order, toggleSelected, selected }: OrderTicketProps) => {
    const { origins } = useBariPizzaContext();
    const { open, isOpen, close } = useDialogProps();

    const { ticket } = useOrderDashboardContext();
    const theme = useTheme();
    const ticketRef = useRef<SVGSVGElement>(null);

    if (ticketRef.current) {
        ticket.refs[order.order_id] = ticketRef;
    }

    const cardSX = {
        width: 225,
        position: 'relative',
        height: 150,
        transition: 'background-color 1s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:not(.toast-error)': {
            backgroundColor: selected ? theme.palette.primary.light : 'background.paper',
        },
        '&.toast-error': {
            backgroundColor: theme.palette.error.light,
            transition: 'background-color 1s ease',
        },
        '&.ticket-animating': {
            '&.hide-when-animating': {
                Visibility: 'hidden',
            },
        },
    };

    const handleSelect = () => {
        toggleSelected(order);
    };

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        open();
    };

    const orderOrigin = origins.find((origin) => origin.origin_id === order.origin_id)!;

    const { payments } = order;

    const initialPayment = payments?.[0];

    const totalPayments = payments?.reduce((acc, payment) => acc + payment?.amount_in_cents || 0, 0);
    const totalTips = payments?.reduce((acc, payment) => acc + payment?.tip_in_cents || 0, 0);
    const isPaidValid = totalPayments === order.total_in_cents;
    const isLocked = order.is_locked;

    return (
        <Card variant="elevation" sx={cardSX} raised className="lottie-icon-container order-ticket">
            <CardActionArea onClick={handleSelect}>
                <Stack direction="column">
                    <Stack direction="row" m={1} mb={0} justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" className={order.order_name ? 'order-name' : 'order-number'}>
                            {order.order_name ?? `Order #${order.order_number || 'N/A'}`}
                        </Typography>
                        {selected ? (
                            <>
                                <LocalPizzaRoundedIcon color={'primary'} ref={ticketRef} />
                                <img
                                    src="../../assets/pizza slice.png"
                                    alt="pizza"
                                    width="24px"
                                    height="24px"
                                    style={{ position: 'fixed', opacity: 0 }}
                                />
                            </>
                        ) : (
                            <LocalPizzaOutlinedIcon className="hide-when-animating" />
                        )}
                    </Stack>
                </Stack>
            </CardActionArea>
            <CardActionArea
                onClick={handleEditClick}
                sx={{ display: 'flex', justifyContent: 'space-between', height: '-webkit-fill-available' }}
                disableRipple>
                <Stack direction="column" width="100%" justifyContent="space-between" height="100%">
                    <Stack direction="row" spacing={1} pl={1} pr={1} justifyContent="space-between">
                        {payments.length > 0 ? (
                            <>
                                <PaymentTypeIcon paymentType={initialPayment?.payment_type} />
                                <Divider orientation="vertical" />
                                <Typography
                                    variant="body1"
                                    color={isPaidValid ? 'primary' : 'error'}
                                    className="order-total">
                                    {formatCurrency(order.total_in_cents)}
                                </Typography>
                                <Divider orientation="vertical" />
                                <Typography
                                    variant="body1"
                                    color={totalTips > 0 ? 'primary' : 'error'}
                                    className="order-tips">
                                    {formatCurrency(totalTips)}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body1" color="error" className="order-total">
                                {formatCurrency(order.total_in_cents)}
                            </Typography>
                        )}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" m={1} mt={0} alignItems="center">
                        <Stack direction="row" alignItems="center" gap={1}>
                            <OriginLogo orderOrigin={orderOrigin} />
                            <OrderTypeIcon orderType={order.order_type} />
                        </Stack>
                        <OpenInNewIcon />
                    </Stack>
                </Stack>
            </CardActionArea>
            {isLocked && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        height: '100%',
                        width: '100%',
                        color: 'rgb(11 7 7 / 66%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <LockLottieIcon height="8em" width="8em" />
                </div>
            )}

            <OrderEditor order={order} asDialog close={close} isOpen={isOpen} />
        </Card>
    );
};

export const OrderTicketSkeleton = () => {
    return (
        <Skeleton variant="rectangular">
            <Card sx={{ width: 200, height: 300 }} />
        </Skeleton>
    );
};
