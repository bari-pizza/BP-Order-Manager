import { DriverDrawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../Base/DrawerCardBase';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';

interface DriverCardProps {
    driver: DriverDrawer;
}

export const DriverCard = ({ driver }: DriverCardProps) => {
    const { orders, drivers } = useManagerDashboardContext();

    const badgeCount = orders.byDrawerID(driver.drawer_id).length;

    return (
        <DrawerCardBase
            key={driver.drawer_id}
            drawer={driver}
            handleClick={() => drivers.handleClick(driver)}
            badgeCount={badgeCount}
            isOpen={drivers.current?.drawer_id === driver.drawer_id}
        />
    );
};
