import { useRef } from 'react';
import { Card, Typography, CardActionArea, Skeleton, Stack, Collapse, Box, BoxProps } from '@mui/material';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import LocalPizzaRoundedIcon from '@mui/icons-material/LocalPizzaRounded';
import { Order } from '../../typesAndValidators';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { useDialogProps } from '../../hooks/ui/useDialogProps';
import {
    ExpandMore as ExpandMoreIcon,
    OpenInNew as OpenInNewIcon,
    TwoWheeler as DeliveryIcon,
    Restaurant as PickupIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { useBariPizzaContext, useOrderDashboardContext } from '../../hooks/data/useContextData';
import pizzaSrc from '/pizza slice.png';

interface ExpandMoreProps extends BoxProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expand, ...other } = props;
    return <Box {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

interface OrderTicketProps {
    order: Order;
    toggleCollapsed: (order: Order) => void;
    collapsed: boolean;
    toggleSelected: (order: Order) => void;
    selected: boolean;
}

export const OrderTicket = ({ order, toggleCollapsed, collapsed, toggleSelected, selected }: OrderTicketProps) => {
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

    const handleCollapse = () => {
        toggleCollapsed(order);
    };

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        open();
    };

    const orderOrigin = origins.find((origin) => origin.origin_id === order.origin_id)!;
    const originLogo = orderOrigin.icon || '';

    return (
        <Card variant="elevation" sx={cardSX} raised>
            <CardActionArea onClick={handleSelect}>
                <Stack direction="column">
                    <Stack direction="row" m={1} mb={0} justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">{order.order_name ?? `Order #${order.order_number}`}</Typography>
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
                onClick={handleCollapse}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
                disableRipple>
                <Stack direction="column" width="100%">
                    <Collapse in={!collapsed} timeout="auto">
                        <Stack direction="row" justifyContent="space-between" pl={1} pr={1}>
                            <Stack direction="column">
                                <Typography variant="body1">{order.phone}</Typography>
                                <Typography variant="body1">${(order.total_in_cents / 100).toFixed(2)}</Typography>
                            </Stack>
                            <Box component="span" sx={{ cursor: 'pointer' }} onClick={handleEditClick}>
                                <OpenInNewIcon />
                            </Box>
                        </Stack>
                    </Collapse>
                    <Stack direction="row" justifyContent="space-between" m={1} mt={0} alignItems="center">
                        <Stack direction="row" alignItems="center" gap={1}>
                            {originLogo && (
                                <img
                                    src={originLogo}
                                    alt={orderOrigin.name}
                                    width="24px"
                                    height="24px"
                                    style={{ borderRadius: '50%' }}
                                />
                            )}
                            {order.order_type === 'pickup' ? <PickupIcon /> : <DeliveryIcon />}
                        </Stack>
                        <ExpandMore expand={!collapsed}>
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Stack>
                </Stack>
            </CardActionArea>
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
