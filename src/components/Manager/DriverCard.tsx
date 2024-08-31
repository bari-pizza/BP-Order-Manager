import { Dialog, Button } from '@mui/material';
import { DriverDrawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../Base/DrawerCardBase';
import { useDrivers } from '../../hooks/data/useDrivers';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';

interface DriverCardProps {
    driver: DriverDrawer;
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

export const DriverCard = ({ driver, open, close, isOpen }: DriverCardProps) => {
    const { orders } = useManagerDashboardContext();
    const {
        drivers: { remove: removeDriver },
    } = useDrivers();
    const handleDriverClick = (driver: DriverDrawer) => {
        console.log('clicked driver', driver);
        open();
    };
    const handleConfirm = () => {
        console.log('clicked remove', driver);
        removeDriver(driver);
        close();
    };

    const badgeCount = orders.byDrawerID(driver.drawer_id).length;

    return (
        <>
            <DrawerCardBase
                key={driver.drawer_id}
                drawer={driver}
                handleClick={() => handleDriverClick(driver)}
                badgeCount={badgeCount}
            />
            <Dialog open={isOpen} onClose={close}>
                Are you sure you want to remove this driver?
                <Button onClick={handleConfirm}>Confirm</Button>
            </Dialog>
        </>
    );
};
