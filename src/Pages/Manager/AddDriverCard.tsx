import { useState } from 'react';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { Driver_Drawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../../components/Base/DrawerCardBase';
import {
    Dialog,
    Autocomplete,
    TextField,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Divider,
} from '@mui/material';

interface AddDriverCardProps {
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

export const AddDriverCard = ({ open, close, isOpen }: AddDriverCardProps) => {
    const { drivers } = useManagerDashboardContext();
    const { available: availableDrivers, add: addDriver } = drivers;
    const [selectedDriver, setSelectedDriver] = useState<Driver_Drawer | null>(null);

    const dummyDrawer: Driver_Drawer = {
        created_at: '2024-08-27T00:00:00.000Z',
        drawer_id: '3',
        drawer_type: 'driver',
        name: 'Add Driver',
        driver: {
            id: '3',
            email: 'vI8Pb@example.com',
            first_name: 'Add',
            is_admin: false,
            is_manager: false,
            is_cashier: false,
            last_name: 'Driver',
            phone: '555-555-5555',
            avatar_src: availableDrivers?.length ? 'https://i.pravatar.cc/300' : '',
        },
    };

    const closeDialog = () => {
        // setMode('existing');
        close();
    };

    const handleClick = () => {
        open();
    };

    const sx = {
        button: {
            height: '16em',
            width: '12em',
        },
        avatar: {
            width: '6em',
            height: '6em',
        },
    };

    const handleChange = (drawerID: string) => {
        console.log({ drawerID });
        const driver = availableDrivers.find((d) => d.drawer_id === drawerID) as Driver_Drawer;
        setSelectedDriver(driver);
    };

    const handleChooseExistingDriver = () => {
        addDriver(selectedDriver as Driver_Drawer);
        setSelectedDriver(null);
        closeDialog();
    };

    return (
        <>
            <DrawerCardBase sx={sx} drawer={dummyDrawer} handleClick={handleClick} badgeCount={0} />
            <Dialog open={isOpen} onClose={closeDialog}>
                <DialogTitle sx={{ textAlign: 'center' }}>Choose Driver</DialogTitle>
                <DialogContent>
                    <Stack direction="column" mt={2} gap={2}>
                        {availableDrivers.length ? (
                            <Autocomplete
                                options={availableDrivers.map((driver) => driver.drawer_id)}
                                sx={{ width: 225 }}
                                onChange={(_, drawerID) => handleChange(drawerID || '')}
                                renderInput={(params) => <TextField {...params} label="Driver" />}
                                getOptionLabel={(option) =>
                                    availableDrivers.find((d) => d.drawer_id === option)?.name || ''
                                }
                            />
                        ) : (
                            <TextField label="No Drivers Available" disabled />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '1em' }}>
                    <Stack direction="column" gap={2} mb={2}>
                        <Button variant="contained" onClick={handleChooseExistingDriver} disabled={!selectedDriver}>
                            Add Driver
                        </Button>
                        <Divider />
                        <Button onClick={() => console.log('take user to admin page to add new driver')}>
                            Create New Driver
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
};
