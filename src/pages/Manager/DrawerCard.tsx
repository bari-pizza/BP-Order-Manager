import { Drawer, Driver_Drawer } from '../../typesAndValidators';
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

interface DrawerCardProps {
    drawer: Drawer | Driver_Drawer;
    sx?: {
        avatar?: React.CSSProperties;
        badge?: React.CSSProperties;
        avatarIcon?: React.CSSProperties;
        button?: React.CSSProperties;
    };
    props?: DrawerCardSlotProps;
    canOpen?: boolean;
}

export const DrawerCard = ({ drawer, sx, props, canOpen = true }: DrawerCardProps) => {
    const {
        orders,
        // drivers
        drawers,
    } = useManagerDashboardContext();

    const badgeCount = orders.byDrawerID(drawer.drawer_id).length;

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
            badgeCount={badgeCount}
            props={props}
            key={drawer.drawer_id}
            drawer={drawer}
            handleClick={() => drawers.onClick(drawer)}
            isOpen={drawers.current?.drawer_id === drawer.drawer_id && canOpen}
        />
    );
};

const DrawerContextMenu = ({ drawer }: { drawer: Drawer | Driver_Drawer }) => {
    const smartNavigate = useSmartNavigate();
    const { orders, drivers, drawers } = useManagerDashboardContext();
    const drawerOrders = orders.byDrawerID(drawer.drawer_id);
    const currentDrawer = drawers.current;

    const navigateToDrawerOrders = () => {
        smartNavigate({
            to: '/orders',
            keepSearchParams: true,
        });

        if (currentDrawer?.drawer_id !== drawer.drawer_id) {
            drawers.onClick(drawer);
        }
    };

    let handleRemoveDriverClick;

    if (drawerOrders.length === 0 && 'driver' in drawer) {
        handleRemoveDriverClick = () => {
            drivers.remove(drawer);
        };
    }

    const closeDriver = () => {
        drawers.close(drawer);
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

DrawerCard.contextMenu = DrawerContextMenu;
