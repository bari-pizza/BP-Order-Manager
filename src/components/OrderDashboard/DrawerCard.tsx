import { useRef } from 'react';
import { Tooltip, Typography } from '@mui/material';
import type { Drawer, DriverDrawer } from '../../typesAndValidators';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import { DrawerCardBase, DrawerCardBaseSkeleton } from '../Base/DrawerCardBase';

interface DrawerCardProps {
    drawer: Drawer | DriverDrawer;
}

export const DrawerCard = ({ drawer }: DrawerCardProps) => {
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
