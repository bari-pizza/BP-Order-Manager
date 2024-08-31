import { Dialog, Button } from '@mui/material';
import { DriverDrawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../Base/DrawerCardBase';
import { useDrivers } from '../../hooks/data/useDrivers';

interface DriverCardProps {
    driver: DriverDrawer;
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

export const DriverCard = ({ driver, open, close, isOpen }: DriverCardProps) => {
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

    return (
        <>
            <DrawerCardBase key={driver.drawer_id} drawer={driver} handleClick={() => handleDriverClick(driver)} />
            <Dialog open={isOpen} onClose={close}>
                Are you sure you want to remove this driver?
                <Button onClick={handleConfirm}>Confirm</Button>
            </Dialog>
        </>
    );
};
