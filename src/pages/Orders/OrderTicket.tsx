import { useRef } from 'react';
import { Card, Typography, CardActionArea, Skeleton, Stack } from '@mui/material';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import LocalPizzaRoundedIcon from '@mui/icons-material/LocalPizzaRounded';
import { Order_Payment } from '../../typesAndValidators';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { useDialogProps } from '../../hooks/ui/useDialogProps';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useBariPizzaContext, useOrderDashboardContext } from '../../hooks/data/useContextData';
import pizzaSrc from '/pizza slice.png';
import { OrderTypeIcon } from '../../components/Order/OrderTypeIcon';
import { OriginLogo } from '../../components/Order/OriginLogo';
import { Lock as LockIcon } from '@mui/icons-material';
import { AnimationProps, motion } from 'framer-motion';
import { PaymentTypeIcon } from './PaymentTypeIcon';

interface OrderTicketProps {
    order: Order_Payment;
    toggleSelected: (order: Order_Payment) => void;
    selected: boolean;
}

export const OrderTicket = ({ order, toggleSelected, selected }: OrderTicketProps) => {
    const { origins } = useBariPizzaContext();
    const { open, isOpen, close } = useDialogProps();

    const { ticket } = useOrderDashboardContext();
    const theme = useTheme();
    const ticketRef = useRef<SVGSVGElement>(null);

    if (ticketRef.current) {
        ticket.refs[order.order_id] = ticketRef;
    }

    const cardSX = {
        width: 200,
        position: 'relative',
        height: 'min-content',
        transition: 'background-color 1s ease',
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
    const isPaid = totalPayments === order.total_in_cents;
    const isLocked = order.is_locked;

    const containerVariants: AnimationProps['variants'] = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
        },
        hover: { opacity: 1 },
    };

    const iconVariants: AnimationProps['variants'] = {
        initial: {
            opacity: 1,
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 },
        },
        hover: {
            scale: 1.25,
            transition: { duration: 0.5 },
        },
    };

    return (
        <Card variant="elevation" sx={cardSX} raised>
            <CardActionArea onClick={handleSelect}>
                <Stack direction="column">
                    <Stack direction="row" m={1} mb={0} justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">
                            {order.order_name ?? `Order #${order.order_number || 'N/A'}`}
                        </Typography>
                        {selected ? (
                            <>
                                <LocalPizzaRoundedIcon color={'primary'} ref={ticketRef} />
                                <img
                                    src={pizzaSrc}
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
                sx={{ display: 'flex', justifyContent: 'space-between' }}
                disableRipple>
                <Stack direction="column" width="100%">
                    <Stack direction="row" spacing={1} pl={1} pr={1}>
                        <Typography variant="body1" color={isPaid ? 'primary' : 'error'}>
                            ${(order.total_in_cents / 100).toFixed(2)}
                        </Typography>
                        <PaymentTypeIcon paymentType={initialPayment?.payment_type} />
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
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
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
                    <motion.div variants={iconVariants}>
                        <LockIcon sx={{ fontSize: '5em' }} />
                    </motion.div>
                </motion.div>
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
