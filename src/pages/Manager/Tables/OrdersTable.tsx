import { IconButton, Stack, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { OrderWithFullDetails, Payment } from '../../../typesAndValidators';
import { OrderTypeIcon } from '../../../components/Order/OrderTypeIcon';
import { OriginLogo } from '../../../components/Order/OriginLogo';
import { DrawerAvatar } from '../../../components/Base/DrawerAvatar';
import { formatCurrency } from '../../../utils';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
import { toast } from 'react-toastify';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { OrderEditor } from '../../Orders/OrderEditor/OrderEditor';
import { useOrdersDrawersTickets } from '../../../hooks/data/useOrdersDrawersTickets';
// import { toast } from 'react-toastify';

export const OrdersTable = ({ orders }: { orders: OrderWithFullDetails[] }) => {
    const rows = orders;

    const columns: GridColDef<OrderWithFullDetails>[] = [
        {
            field: 'drawer',
            headerName: 'Drawer',
            flex: 1,
            renderCell: (params) => {
                const { row } = params;
                const { drawer, driver } = row;
                return (
                    <Stack direction="row" alignItems="center" height="100%" spacing={1}>
                        <DrawerAvatar drawer={driver ?? drawer} variant="border" />
                        <Typography>{driver?.name ?? drawer?.name ?? 'Unassigned'}</Typography>
                    </Stack>
                );
            },
        },
        {
            field: 'number/name',
            headerName: 'Order #',
            flex: 1,
            valueGetter: (_value, row) => {
                const orderNumber = row.order_number;
                const orderName = row.order_name;
                return orderNumber
                    ? orderNumber.toString().padStart(3, '0') // Pad with leading zeros
                    : orderName || ''; // Use order_name if order_number is not available
            },
            renderCell: (params) => {
                const { row } = params;
                const { order_number, order_name, origin, order_type } = row;
                return (
                    <Stack direction="row" alignItems="center" height="100%" spacing={2}>
                        <OriginLogo orderOrigin={origin} size="medium" variant="border" />
                        <OrderTypeIcon orderType={order_type} />
                        <span>{order_number ?? order_name}</span>
                    </Stack>
                );
            },
        },
        {
            field: 'total_in_cents',
            headerName: 'Total',
            flex: 1,
            renderCell: (params) => {
                const { row } = params;
                const { total_in_cents, payments } = row;
                const totalPaid = payments.reduce((acc: number, curr) => acc + curr.amount_in_cents, 0);
                const isPaid = totalPaid === total_in_cents;
                return (
                    <Stack direction="row" alignItems="center" height="100%" spacing={1}>
                        <Typography variant="body1" color={isPaid ? 'primary' : 'error'}>
                            {formatCurrency(total_in_cents)}
                        </Typography>
                    </Stack>
                );
            },
        },
        {
            field: 'edit',
            headerName: 'Edit',
            flex: 1,
            renderCell: ({ row }) => {
                return <RenderEditButton order={row} />;
            },
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            valueGetter: (_, { payments }) => {
                const value = payments.length > 0 ? 1 : 0;
                return value;
            },
            renderCell: ({ row: { order_id, payments } }) => (
                <RenderDeleteButton payments={payments} orderID={order_id} />
            ),
        },
    ];

    return (
        <Stack direction="column" minHeight="300px">
            <DataGrid
                rows={rows}
                columns={columns}
                disableVirtualization
                getRowId={(row) => row.order_id}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowClassName={() => {
                    return 'lottie-icon-container';
                }}
                hideFooter
            />
        </Stack>
    );
};

const RenderEditButton = ({ order }: { order: OrderWithFullDetails }) => {
    const { isOpen, close, open } = useDialogProps();
    const {
        orders: { isRepeat },
    } = useOrdersDrawersTickets();
    return (
        <>
            <IconButton>
                <EditIcon onClick={() => open()} />
            </IconButton>
            <OrderEditor order={order} asDialog close={close} isOpen={isOpen} isRepeat={isRepeat} />
        </>
    );
};

const RenderDeleteButton = ({ payments, orderID }: { payments: Payment[]; orderID: string }) => {
    const {
        orders: { delete: deleteOrder },
    } = useManagerDashboardContext();
    const value = payments.length > 0 ? 1 : 0;

    const handleDeleteClick = () => {
        if (value === 0) handleConfirmDeleteOrder(orderID);
        if (value === 1) toast.error('Delete all payments before deleting');
        // if (value === 2) toast.error('Unassign order before deleting');
        // if (value === 3) toast.error('Unassign order and remove all payments before deleting');
    };

    const { handleConfirmation: handleConfirmDeleteOrder } = useConfirmationToast<string>({
        message: 'Are you sure you want to delete this order?',
        // confirmProps: {
        //     handler: () => deleteOrder(orderID),
        //     buttonText: 'Delete',
        //     color: 'error',
        // },
        cancelProps: {
            buttonText: 'Cancel',
            color: 'info',
        },
        confirmProps: {
            color: 'error',
            variant: 'outlined',
            handler: (orderID) => {
                console.log(`trying to delete ${orderID}`);
                deleteOrder(orderID);
            },
            buttonText: 'Delete',
        },
    });
    return (
        <Stack direction="row" alignItems="center" height="100%" spacing={1}>
            <IconButton onClick={handleDeleteClick} color={value === 0 ? 'error' : 'default'}>
                <DeleteIcon />
            </IconButton>
        </Stack>
    );
};
