import { Stack, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModel,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { PaymentWithFullDetails } from '../../../typesAndValidators';
import { useDataGrid } from '../../../hooks/ui/useDataGrid';
import { OrderTypeIcon } from '../../../components/Order/OrderTypeIcon';
import { OriginLogo } from '../../../components/Order/OriginLogo';
import { DrawerAvatar } from '../../../components/Base/DrawerAvatar';
import { formatCurrency } from '../../../utils';

export const CardsTable = ({ payments }: { payments: PaymentWithFullDetails[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid<PaymentWithFullDetails>({ data: payments });

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        console.log('processRowUpdate', newRow);
        const updatedRow = {
            ...(newRow as PaymentWithFullDetails),
            // isNew: false
        };
        setRows((prev) => prev.map((row) => (row.payment_id === newRow.payment_id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef<PaymentWithFullDetails>[] = [
        {
            field: 'drawer',
            headerName: 'Drawer',
            flex: 1,
            valueGetter: (value, { drawer, driver }) => driver?.name ?? drawer?.name ?? 'Unassigned',
            renderCell: (params) => {
                const { row } = params;
                const { drawer, driver } = row;
                return (
                    <Stack direction="row" alignItems="center" height="100%" spacing={2}>
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
            valueGetter: (value, row) => {
                const orderNumber = row.order?.order_number;
                const orderName = row.order?.order_name;
                return orderNumber
                    ? orderNumber.toString().padStart(3, '0') // Pad with leading zeros
                    : orderName || ''; // Use order_name if order_number is not available
            },
            renderCell: (params) => {
                const { row } = params;
                const {
                    order: { order_number, order_name, order_type },
                    origin,
                } = row;
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
            field: 'amount_in_cents',
            headerName: 'Total',
            flex: 1,
            valueFormatter: (value) => formatCurrency(value as number),
        },
        {
            field: 'tip_in_cents',
            headerName: 'Tips',
            flex: 1,
            valueFormatter: (value) => formatCurrency(value as number),
        },
    ];
    return (
        <Stack direction="column">
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                processRowUpdate={processRowUpdate}
                onRowEditStop={handleRowEditStop}
                getRowId={(row) => row.order_id}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowClassName={() => {
                    return 'lottie-icon-container';
                }}
            />
        </Stack>
    );
};
