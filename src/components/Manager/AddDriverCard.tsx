import { useState } from 'react';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { DriverDrawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../Base/DrawerCardBase';
import { Dialog, Autocomplete, TextField, Button } from '@mui/material';

interface AddDriverCardProps {
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

export const AddDriverCard = ({ open, close, isOpen }: AddDriverCardProps) => {
    const { driver } = useManagerDashboardContext();
    const { all: allDrivers, add: addDriver } = driver;
    const [selectedDriver, setSelectedDriver] = useState<DriverDrawer | null>(null);

    const dummyDrawer: DriverDrawer = {
        created_at: '2024-08-27T00:00:00.000Z',
        drawer_id: '3',
        drawer_type: 'driver',
        name: 'Add Driver',
        driver: {
            id: '3',
            email: 'vI8Pb@example.com',
            first_name: 'Jane',
            is_admin: false,
            is_manager: false,
            last_name: 'Doe',
            phone: '555-555-5555',
            avatar_src: null,
        },
    };

    const handleSubmit = () => {
        console.log({ selectedDriver });
        // call a mutation to add the driver to the business day
        if (selectedDriver) {
            addDriver(selectedDriver);
        }
        close();
    };

    const handleChange = (drawerID: string) => {
        const driver = allDrivers.find((d) => d.drawer_id === drawerID) as DriverDrawer;
        setSelectedDriver(driver);
    };

    const handleClick = () => {
        setSelectedDriver(null);
        open();
    };

    return (
        <>
            <DrawerCardBase drawer={dummyDrawer} handleClick={handleClick} />
            <Dialog open={isOpen} onClose={close}>
                <Autocomplete
                    options={allDrivers.map((driver) => driver.drawer_id)}
                    sx={{ width: 300 }}
                    onChange={(_, drawerID) => handleChange(drawerID || '')}
                    renderInput={(params) => <TextField {...params} label="Driver" />}
                    getOptionLabel={(option) => allDrivers.find((d) => d.drawer_id === option)?.name || ''}
                />
                <Button onClick={handleSubmit}>Submit</Button>
            </Dialog>
        </>
    );
};
