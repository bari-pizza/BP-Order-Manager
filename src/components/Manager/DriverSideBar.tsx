import { Stack, Typography } from '@mui/material';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { SideBar } from '../SideBar';
import { DrawerCardSlotProps } from '../Base/DrawerCardBase';
import { ContextMenu } from '../Base/ContextMenu';
import { DriverCard } from './DriverCard';

export const DriverSideBar = () => {
    const { orders, drivers } = useManagerDashboardContext();
    const currentDriver = drivers.current;
    if (!currentDriver) {
        return null;
    }
    const driversOrders = orders.byDrawerID(currentDriver.drawer_id);
    const driverSummary = {
        total_in_cents: 0,
        orders: 0,
        cash: 0,
        credit: 0,
    };
    driversOrders.forEach((order) => {
        driverSummary.total_in_cents += order.total_in_cents;
        driverSummary.orders += 1;
        // driverSummary.cash += order.cash;
        // driverSummary.credit += order.credit;
    });

    const sx = {
        avatar: {
            width: '6em',
            height: '6em',
        },
        avatarIcon: {
            width: '4em',
            height: '4em',
        },
        button: {
            height: '12em',
            width: '300px',
            '&.open-drawer': {
                backgroundColor: 'orange',
            },
        },
    };

    const props: DrawerCardSlotProps = {
        button: { variant: 'text', disabled: true, disableRipple: true },
        buttonStack: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
        nameTypography: { variant: 'h6' },
    };

    return (
        <SideBar width="350px">
            <Stack direction="column" height="100vh" spacing={2} alignItems="center" mt={2}>
                <Stack direction="column" alignItems="center" gap={2}>
                    <ContextMenu openOnType="click">
                        <ContextMenu.Base>
                            <DriverCard driver={currentDriver} sx={sx} props={props} canOpen={false} />
                        </ContextMenu.Base>
                        <DriverCard.contextMenu driver={currentDriver} />
                    </ContextMenu>
                    <Typography variant="h6">ORDERS: {driverSummary.orders}</Typography>
                    <Typography variant="h6">TOTAL: ${(driverSummary.total_in_cents / 100).toFixed(2)}</Typography>
                </Stack>
            </Stack>
        </SideBar>
    );
};
