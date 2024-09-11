import { useRef } from 'react';
import { Tooltip, Typography } from '@mui/material';
import type { Drawer, Driver_Drawer } from '../../typesAndValidators';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import { DrawerCardBase, DrawerCardBaseSkeleton, DrawerCardSlotProps } from '../../components/Base/DrawerCardBase';
import { ContextMenu } from '../../components/Base/ContextMenu';
import { useLocalStorage } from '../../hooks/data/useLocalStorage';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useSmartNavigate } from '../../hooks/navigation/useSmartNavigate';

interface DrawerCardProps {
    drawer: Drawer | Driver_Drawer;
    sx?: {
        avatar?: React.CSSProperties;
        badge?: React.CSSProperties;
        avatarIcon?: React.CSSProperties;
        button?: React.CSSProperties;
    };
    props?: DrawerCardSlotProps;
}

export const DrawerCard = ({ drawer, sx, props }: DrawerCardProps) => {
    const { drawer: ctxDrawer, orders, ticket } = useOrderDashboardContext();
    const fullName = getDrawerFullName(drawer);
    const isOpen = ctxDrawer.current?.drawer_id === drawer?.drawer_id;
    const orderCount = orders.byDrawerID(drawer.drawer_id).length;
    const drawerRef = useRef<HTMLDivElement>(null);

    if (drawerRef.current) {
        ctxDrawer.refs[drawer.drawer_id] = drawerRef;
    }

    const selectedTicketsCount = ticket.count.selected;

    const tooltip =
        !isOpen && selectedTicketsCount ? (
            <Typography variant="body2">
                Add {selectedTicketsCount} tickets to {fullName}
            </Typography>
        ) : (
            ''
        );

    // Used React Fragment to stop tooltip from warning that its children can't be passed a ref
    return (
        <Tooltip title={tooltip}>
            <>
                <DrawerCardBase
                    drawer={drawer}
                    drawerRef={drawerRef}
                    isOpen={isOpen}
                    badgeCount={orderCount}
                    handleClick={() => ctxDrawer.onClick(drawer)}
                    sx={sx}
                    props={props}
                />
            </>
        </Tooltip>
    );
};

export const UnassignedDrawerAvatar = () => {
    const { drawer } = useOrderDashboardContext();
    return <DrawerCard drawer={drawer.unassigned} />;
};

export const DrawerAvatarSkeleton = () => {
    return <DrawerCardBaseSkeleton />;
};

const DriverContextMenu = ({ driver }: { driver: Driver_Drawer }) => {
    const { setValue: setTabName } = useLocalStorage<'managerDashboardTabName'>('managerDashboardTabName');
    const { setValue: setDriver } = useLocalStorage<'openDrawer'>('openDrawer');
    const smartNavigate = useSmartNavigate();

    const navigateToManagerDashboard = () => {
        setTabName('drivers');
        setDriver(driver);
        smartNavigate({ to: '/manager', keepSearchParams: true });
    };

    return (
        <ContextMenu.Menu>
            <ContextMenu.MenuItem onClick={navigateToManagerDashboard} icon={<OpenInNewIcon />}>
                Open in Manager
            </ContextMenu.MenuItem>
            <ContextMenu.MenuItem>Some info goes here</ContextMenu.MenuItem>
        </ContextMenu.Menu>
    );
};

DrawerCard.driverContextMenu = DriverContextMenu;
