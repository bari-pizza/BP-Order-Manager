import { Card, Typography, CardActionArea, Skeleton, Stack, Collapse, Box } from '@mui/material';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import LocalPizzaRoundedIcon from '@mui/icons-material/LocalPizzaRounded';
import { Order } from '../../typesAndValidators';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { ExpandMore as ExpandMoreIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import pizzaSrc from '../../assets/pizza slice.png';

interface OrderTicketProps {
    order: Order;
    toggleCollapsed: (order: Order) => void;
    collapsed: boolean;
    toggleSelected: (order: Order) => void;
    selected: boolean;
}

export const OrderTicket = ({ order, toggleCollapsed, collapsed, toggleSelected, selected }: OrderTicketProps) => {
    const { setOpen, orderEditor } = useOrderEditor({
        order,
        asDialog: true,
    });
    const { ticket } = useOrderDashboardContext();
    const theme = useTheme();
    const ticketRef = useRef<SVGSVGElement>(null);

    if (ticketRef.current) {
        ticket.refs[order.order_id] = ticketRef;
    }

    const cardSX = {
        width: 200,
        height: 'min-content',
        backgroundColor: selected ? theme.palette.primary.light : 'background.paper',
    };

    const handleSelect = () => {
        toggleSelected(order);
    };

    const handleCollapse = () => {
        toggleCollapsed(order);
    };

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <Card variant="outlined" sx={cardSX}>
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
                            <LocalPizzaOutlinedIcon />
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
                        <Typography variant="subtitle1">{order.order_type}</Typography>
                        <ExpandMoreIcon />
                    </Stack>
                </Stack>
            </CardActionArea>
            {orderEditor}
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
