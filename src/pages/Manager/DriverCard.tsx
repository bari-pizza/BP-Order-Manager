import { Driver_Drawer } from '../../typesAndValidators';
import { DrawerCardBase, DrawerCardSlotProps } from '../../components/Base/DrawerCardBase';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { ContextMenu } from '../../components/Base/ContextMenu';
import { useSmartNavigate } from '../../hooks/navigation/useSmartNavigate';
import {
    OpenInNew as OpenInNewIcon,
    AccountBalanceWallet as WalletIcon,
    RemoveCircleOutline as RemoveDriverIcon,
} from '@mui/icons-material';
import { deepmerge } from '@mui/utils';

interface DriverCardProps {
    driver: Driver_Drawer;
    sx?: {
        avatar?: React.CSSProperties;
        badge?: React.CSSProperties;
        avatarIcon?: React.CSSProperties;
        button?: React.CSSProperties;
    };
    props?: DrawerCardSlotProps;
    canOpen?: boolean;
}

export const DriverCard = ({ driver, sx, props, canOpen = true }: DriverCardProps) => {
    const { orders, drivers } = useManagerDashboardContext();

    const badgeCount = orders.byDrawerID(driver.drawer_id).length;

    const baseSX = {
        avatar: {
            width: '6em',
            height: '6em',
        },
        button: {
            height: '16em',
            width: '12em',
        },
    };

    const overrideSX = deepmerge(baseSX, sx);

    return (
        <DrawerCardBase
            sx={overrideSX}
            key={driver.drawer_id}
            drawer={driver}
            handleClick={() => drivers.handleClick(driver)}
            badgeCount={badgeCount}
            isOpen={drivers.current?.drawer_id === driver.drawer_id && canOpen}
            props={props}
        />
    );
};

const DriverContextMenu = ({ driver }: { driver: Driver_Drawer }) => {
    const smartNavigate = useSmartNavigate();
    const { orders, drivers, drawers } = useManagerDashboardContext();
    const driversOrders = orders.byDrawerID(driver.drawer_id);

    const navigateToDrawerOrders = () => {
        smartNavigate({
            to: '/orders',
            keepSearchParams: true,
        });

        drawers.onClick(driver);
    };

    let handleRemoveDriverClick;

    if (driversOrders.length === 0) {
        handleRemoveDriverClick = () => {
            drivers.remove(driver);
        };
    }

    const closeDriver = () => {
        drivers.close(driver);
    };

    return (
        <ContextMenu.Menu>
            <ContextMenu.MenuItem onClick={navigateToDrawerOrders} icon={<OpenInNewIcon />}>
                Open in Orders
            </ContextMenu.MenuItem>
            <ContextMenu.MenuItem onClick={handleRemoveDriverClick} icon={<RemoveDriverIcon />}>
                Remove Driver
            </ContextMenu.MenuItem>
            <ContextMenu.MenuItem onClick={closeDriver} icon={<WalletIcon />}>
                Close Out
            </ContextMenu.MenuItem>
        </ContextMenu.Menu>
    );
};

DriverCard.contextMenu = DriverContextMenu;
