import { Stack, Typography } from '@mui/material';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { SideBar } from '../SideBar';
import { DrawerCardBase, DrawerCardSlotProps } from '../Base/DrawerCardBase';
import { useNavigate } from 'react-router-dom';
import { ContextMenu } from '../Base/ContextMenu';

export const DriverSideBar = () => {
    const { orders, drivers, drawers } = useManagerDashboardContext();
    const navigate = useNavigate();
    if (!drivers?.current) {
        return null;
    }
    const driversOrders = orders.byDrawerID(drivers.current?.drawer_id);
    const driverSummary = {
        total_in_cents: 0,
        orders: 1,
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
        },
    };

    const navigateToDrawerOrders = () => {
        navigate('/orders');
        drawers.onClick(drivers.current!);
    };

    const props: DrawerCardSlotProps = {
        button: { variant: 'text', disabled: true, disableRipple: true },
        // button: {
        //     variant: 'text',
        // },
        buttonStack: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
        nameTypography: { variant: 'h6' },
    };

    return (
        <SideBar width="350px">
            <Stack direction="column" height="100%" spacing={2} alignItems="center" mt={2}>
                <ContextMenu openOnType="click">
                    <ContextMenu.Base>
                        <DrawerCardBase drawer={drivers.current} sx={sx} props={props} />
                    </ContextMenu.Base>
                    <ContextMenu.Menu>
                        <ContextMenu.MenuItem onClick={navigateToDrawerOrders}>
                            Check out my orders
                        </ContextMenu.MenuItem>
                    </ContextMenu.Menu>
                </ContextMenu>
                <Typography variant="h6">ORDERS: {driverSummary.orders}</Typography>
                <Typography variant="h6">TOTAL: ${(driverSummary.total_in_cents / 100).toFixed(2)}</Typography>
            </Stack>
        </SideBar>
    );
};
