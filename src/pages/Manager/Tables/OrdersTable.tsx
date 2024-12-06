import { IconButton, Stack, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModel,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { OrderWithFullDetails, Payment } from '../../../typesAndValidators';
import { useDataGrid } from '../../../hooks/ui/useDataGrid';
import { OrderTypeIcon } from '../../../components/Order/OrderTypeIcon';
import { OriginLogo } from '../../../components/Order/OriginLogo';
import { DrawerAvatar } from '../../../components/Base/DrawerAvatar';
import { formatCurrency } from '../../../utils';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
import { toast } from 'react-toastify';

export const OrdersTable = ({ orders }: { orders: OrderWithFullDetails[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid({ data: orders });

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        console.log('processRowUpdate', newRow);
        const updatedRow = {
            ...(newRow as OrderWithFullDetails),
            // isNew: false
        };
        // updateEmployeeMutation.mutate(updatedRow);
        // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setRows((prev) => prev.map((row) => (row.order_id === newRow.order_id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

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
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            valueGetter: (_value, { payments, drawer_id }) => {
                const value = (payments.length > 0 ? 1 : 0) + (drawer_id ? 2 : 0);
                return value;
            },
            renderCell: ({ row: { order_id, payments, drawer_id } }) => (
                <RenderDeleteButton payments={payments} drawerID={drawer_id} orderID={order_id} />
            ),
        },
    ];
    return (
        <Stack direction="column">
            <DataGrid
                rows={rows}
                columns={columns}
                disableVirtualization
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowId={(row) => row.order_id}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowClassName={() => {
                    return 'lottie-icon-container';
                }}
            />
        </Stack>
    );
};

const RenderDeleteButton = ({
    payments,
    drawerID,
    orderID,
}: {
    payments: Payment[];
    drawerID: string | null;
    orderID: string;
}) => {
    const {
        orders: { delete: deleteOrder },
    } = useManagerDashboardContext();
    const value = (payments.length > 0 ? 1 : 0) + (drawerID ? 2 : 0);

    const handleDeleteClick = () => {
        if (value === 0) handleConfirmDeleteOrder();
        if (value === 1) toast.error('Remove all payments before deleting');
        if (value === 2) toast.error('Unassign order before deleting');
        if (value === 3) toast.error('Unassign order and remove all payments before deleting');
    };

    const { handleConfirmation: handleConfirmDeleteOrder } = useConfirmationToast({
        message: 'Are you sure you want to delete this order?',
        confirmProps: {
            handler: () => deleteOrder(orderID),
            buttonText: 'Delete',
            color: 'error',
        },
        cancelProps: {
            buttonText: 'Cancel',
            color: 'info',
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
