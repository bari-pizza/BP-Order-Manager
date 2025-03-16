import { Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PaymentWithFullDetails } from '../../../typesAndValidators';
import { OrderTypeIcon } from '../../../components/Order/OrderTypeIcon';
import { OriginLogo } from '../../../components/Order/OriginLogo';
import { DrawerAvatar } from '../../../components/Base/DrawerAvatar';
import { formatCurrency } from '../../../utils';

export const CardsTable = ({ payments }: { payments: PaymentWithFullDetails[] }) => {
    const rows = payments;

    const columns: GridColDef<PaymentWithFullDetails>[] = [
        {
            field: 'drawer',
            headerName: 'Drawer',
            flex: 1,
            valueGetter: (_value, { drawer, driver }) => driver?.name ?? drawer?.name ?? 'Unassigned',
            renderCell: (params) => {
                const { row } = params;
                const { drawer, driver } = row;
                return (
                    <Stack direction="row" alignItems="end" height="100%" spacing={2}>
                        <DrawerAvatar drawer={driver ?? drawer} variant="border" />
                        <Typography alignSelf="center">{driver?.name ?? drawer?.name ?? 'Unassigned'}</Typography>
                    </Stack>
                );
            },
        },
        {
            field: 'number/name',
            headerName: 'Order #',
            flex: 1,
            valueGetter: (_value, row) => {
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
                        <OriginLogo orderOrigin={origin} />
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
