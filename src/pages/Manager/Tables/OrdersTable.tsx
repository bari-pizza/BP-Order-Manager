import { Stack, Tooltip } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModel,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { OrderWithFullDetails } from '../../../typesAndValidators';
import { useDataGrid } from '../../../hooks/ui/useDataGrid';
import { OrderTypeIcon } from '../../../components/Order/OrderTypeIcon';
import { OriginLogo } from '../../../components/Order/OriginLogo';
import { DrawerAvatar } from '../../../components/Base/DrawerAvatar';

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
            field: 'number/name',
            headerName: 'Order #',
            width: 175,
            renderCell: (params) => {
                const { row } = params;
                const { order_number, order_name, origin, order_type } = row;
                return (
                    <Tooltip title={`${origin.name} ${order_type} ${order_number ?? order_name}`}>
                        <Stack direction="row" alignItems="center" height="100%" spacing={1}>
                            <OriginLogo orderOrigin={origin} size="medium" variant="border" />
                            <OrderTypeIcon orderType={order_type} />
                            <span>{order_number ?? order_name}</span>
                        </Stack>
                    </Tooltip>
                );
            },
        },
        {
            field: 'drawer',
            headerName: 'Drawer',
            width: 150,
            renderCell: (params) => {
                const { row } = params;
                const { drawer, driver } = row;
                return (
                    <Tooltip title={driver?.name ?? drawer?.name ?? 'Unassigned'}>
                        <Stack direction="row" alignItems="center" height="100%" spacing={1}>
                            <DrawerAvatar drawer={driver ?? drawer} variant="border" />
                        </Stack>
                    </Tooltip>
                );
            },
        },
        {
            field: 'total_in_cents',
            headerName: 'Total',
            width: 150,
            renderCell: (params) => {
                const { row } = params;
                const { total_in_cents } = row;
                return `$${(total_in_cents / 100).toFixed(2)}`;
            },
        },
        {
            field: 'is_paid',
            headerName: 'Paid',
            width: 125,
            renderCell: (params) => {
                const { row } = params;
                const { payments, total_in_cents } = row;
                const totalPaid = payments.reduce((acc: number, curr) => acc + curr.amount_in_cents, 0);
                const is_paid = totalPaid === total_in_cents;
                return is_paid ? 'Yes' : 'No';
            },
        },
        {
            field: 'is_locked',
            headerName: 'Locked',
            width: 125,
            renderCell: () => {
                return 'No';
            },
        },
        {
            field: 'non-cash-tips',
            headerName: 'Tips',
            width: 125,
            renderCell: (params) => {
                const { row } = params;
                const { payments } = row;
                const nonCashTips = payments.reduce((acc: number, curr) => {
                    if (curr.payment_type !== 'cash') {
                        return acc + curr.tip_in_cents;
                    }
                    return acc;
                }, 0);
                return `$${(nonCashTips / 100).toFixed(2)}`;
            },
        },
    ];
    return (
        <Stack direction="column">
            <DataGrid
                // sx={{
                //     '& .row-is-edit': { border: '2px solid', borderColor: 'primary.main' },
                // }}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowId={(row) => row.order_id}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                // getRowClassName={(params) => {
                //     const isEditing = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                //     return isEditing ? 'row-is-edit' : '';
                // }}
            />
        </Stack>
    );
};
