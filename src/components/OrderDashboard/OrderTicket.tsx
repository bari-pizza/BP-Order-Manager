import {
    Button,
    Card,
    // CardHeader,
    CardContent,
    Typography,
    // CardActions,
    CardActionArea,
    Skeleton,
    Stack,
    Checkbox,
    Collapse,
    IconButtonProps,
    styled,
    IconButton,
} from '@mui/material';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import LocalPizzaRoundedIcon from '@mui/icons-material/LocalPizzaRounded';
import { Order } from '../../supabaseQueries';
import { useOrderEditor } from './OrderEditor/useOrderEditor';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

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

    const cardSX = {
        width: 200,
        height: 'min-content',
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
                        <Typography variant="h5">Order #{order.order_number}</Typography>
                        <Checkbox
                            className={selected ? '' : 'show-on-card-hover'}
                            checked={selected}
                            icon={<LocalPizzaOutlinedIcon />}
                            checkedIcon={<LocalPizzaRoundedIcon />}
                            disableRipple
                        />
                    </Stack>
                </Stack>
                <Typography m={1} mt={0} variant="subtitle1">
                    {order.order_type}
                </Typography>
            </CardActionArea>
            <Collapse in={!collapsed} timeout="auto">
                <CardContent>
                    <Typography variant="body1">{order.phone}</Typography>
                    <Typography variant="body1">${(order.total_in_cents / 100).toFixed(2)}</Typography>
                </CardContent>
            </Collapse>
            <CardActionArea
                onClick={handleCollapse}
                sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}
                disableRipple>
                <Button variant="contained" onClick={handleEditClick} className="show-on-card-hover">
                    Edit
                </Button>
                <ExpandMore expand={!collapsed} aria-expanded={!collapsed} aria-label="show more" disableRipple>
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActionArea>
            {/* <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setOpen(true)}>Edit</Button>
                <ExpandMore
                    expand={!collapsed}
                    onClick={handleCollapse}
                    aria-expanded={!collapsed}
                    aria-label="show more">
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions> */}
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
