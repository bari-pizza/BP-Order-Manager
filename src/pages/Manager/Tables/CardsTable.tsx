import { Stack, Tooltip, Typography } from '@mui/material';
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
            field: 'number/name',
            headerName: 'Order #',
            width: 175,
            renderCell: (params) => {
                const { row } = params;
                const {
                    order: { order_number, order_name, order_type },
                    origin,
                } = row;
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
            width: 250,
            renderCell: (params) => {
                const { row } = params;
                const { drawer, driver } = row;
                return (
                    <Tooltip title={driver?.name ?? drawer?.name ?? 'Unassigned'}>
                        <Stack direction="row" alignItems="center" height="100%" spacing={1}>
                            <DrawerAvatar drawer={driver ?? drawer} variant="border" />
                            <Typography>{driver?.name ?? drawer?.name ?? 'Unassigned'}</Typography>
                        </Stack>
                    </Tooltip>
                );
            },
        },
        {
            field: 'amount_in_cents',
            headerName: 'Total',
            width: 150,
            valueFormatter: (value) => formatCurrency(value as number),
        },
        {
            field: 'tip_in_cents',
            headerName: 'Tips',
            width: 125,
            valueFormatter: (value) => formatCurrency(value as number),
        },
    ];
    return (
        <Stack direction="column">
            <DataGrid
                rows={rows}
                columns={columns}
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
