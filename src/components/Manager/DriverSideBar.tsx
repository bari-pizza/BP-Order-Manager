import { Stack, Typography } from '@mui/material';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { SideBar } from '../SideBar';
import { DrawerCardBase, DrawerCardSlotProps } from '../Base/DrawerCardBase';
import { useNavigate } from 'react-router-dom';
import { ContextMenu } from '../Base/ContextMenu';
import {
    OpenInNew as OpenInNewIcon,
    RemoveCircleOutline as RemoveDriverIcon,
    AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';

export const DriverSideBar = () => {
    const { orders, drivers, drawers } = useManagerDashboardContext();
    const navigate = useNavigate();
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

    let handleRemoveDriverClick;

    if (driverSummary.orders === 0) {
        handleRemoveDriverClick = () => {
            drivers.remove(currentDriver);
            drivers.handleClick(currentDriver);
        };
    }

    return (
        <SideBar width="350px">
            <ContextMenu openOnType="click">
                <ContextMenu.Base>
                    <Stack direction="column" height="100vh" spacing={2} alignItems="center" mt={2}>
                        <Stack direction="column" alignItems="center" gap={2}>
                            <DrawerCardBase drawer={currentDriver} sx={sx} props={props} />
                            <Typography variant="h6">ORDERS: {driverSummary.orders}</Typography>
                            <Typography variant="h6">
                                TOTAL: ${(driverSummary.total_in_cents / 100).toFixed(2)}
                            </Typography>
                        </Stack>
                    </Stack>
                </ContextMenu.Base>
                <ContextMenu.Menu>
                    <ContextMenu.MenuItem onClick={navigateToDrawerOrders} icon={<OpenInNewIcon />}>
                        Open in Orders
                    </ContextMenu.MenuItem>
                    <ContextMenu.MenuItem onClick={handleRemoveDriverClick} icon={<RemoveDriverIcon />}>
                        Remove Driver
                    </ContextMenu.MenuItem>
                    <ContextMenu.MenuItem onClick={() => drivers.close(currentDriver)} icon={<WalletIcon />}>
                        Close Out
                    </ContextMenu.MenuItem>
                </ContextMenu.Menu>
            </ContextMenu>
        </SideBar>
    );
};
