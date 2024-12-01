import { Drawer, Driver_Drawer } from '../../typesAndValidators';
import { DrawerCardBase, DrawerCardSlotProps } from '../../components/Base/DrawerCardBase';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { ContextMenu } from '../../components/Base/ContextMenu';
import { useSmartNavigate } from '../../hooks/navigation/useSmartNavigate';
import { OpenInNew as OpenInNewIcon, RemoveCircleOutline as RemoveDriverIcon } from '@mui/icons-material';
import { deepmerge } from '@mui/utils';
import { toast } from 'react-toastify';
import { useConfirmationToast } from '../../toast/useConfirmationToast';

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
    const { orders, drawers, summaries } = useManagerDashboardContext();

    const summary = summaries.byDrawerID(drawer.drawer_id);
    const isLocked = summary?.is_locked || false;

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
            isLocked={isLocked}
        />
    );
};

const DrawerContextMenu = ({ drawer }: { drawer: Drawer | Driver_Drawer }) => {
    const smartNavigate = useSmartNavigate();
    const { orders, drivers, drawers, cashTransfers, summaries } = useManagerDashboardContext();
    const drawerOrders = orders.byDrawerID(drawer.drawer_id);
    const currentDrawer = drawers.current;
    const summary = summaries.byDrawerID(drawer.drawer_id);

    const navigateToDrawerOrders = () => {
        smartNavigate({
            to: '/orders',
            keepSearchParams: true,
        });

        if (currentDrawer?.drawer_id !== drawer.drawer_id) {
            drawers.onClick(drawer);
        }
    };

    const handleRemoveDriverClick = () => {
        if (!('driver' in drawer)) {
            toast.error('Cannot remove driver from non-driver drawer');
            return;
        }
        const { bank, payment, other } = cashTransfers.byDrawerID(drawer.drawer_id);
        if (bank.length + payment.length + other.length > 0) {
            toast.error('Remove all cash transfers before removing driver');
            return;
        }
        if (drawerOrders.length > 0) {
            toast.error('Cannot remove driver unless all orders are removed first');
            return;
        }
        handleConfirmRemoveDriver();
    };

    const { handleConfirmation: handleConfirmRemoveDriver } = useConfirmationToast({
        message: 'Are you sure you want to remove this driver from today?',
        confirmProps: {
            // handler: handleRemoveDriverClick,
            handler: () => drivers.remove(drawer as Driver_Drawer),
            buttonText: 'Delete',
            color: 'error',
        },
        cancelProps: {
            buttonText: 'Cancel',
            color: 'info',
        },
    });

    return (
        <ContextMenu.Menu>
            <ContextMenu.MenuItem onClick={navigateToDrawerOrders} icon={<OpenInNewIcon />}>
                Open in Orders
            </ContextMenu.MenuItem>
            {'driver' in drawer && !summary?.is_locked && (
                <ContextMenu.MenuItem onClick={handleRemoveDriverClick} icon={<RemoveDriverIcon />}>
                    Remove Driver
                </ContextMenu.MenuItem>
            )}
        </ContextMenu.Menu>
    );
};

DrawerCard.contextMenu = DrawerContextMenu;
