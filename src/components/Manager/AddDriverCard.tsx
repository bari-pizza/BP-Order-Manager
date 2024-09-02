import { useState } from 'react';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { DriverDrawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../Base/DrawerCardBase';
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
    const { add: addDriver, available: availableDrivers } = drivers;
    // const [selectedDriver, setSelectedDriver] = useState<DriverDrawer | null>(null);
    const [mode, setMode] = useState<'existing' | 'new'>('existing');

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
            avatar_src: availableDrivers?.length ? 'https://i.pravatar.cc/300' : '',
        },
    };

    // const handleSubmit = () => {
    //     console.log({ selectedDriver });
    //     // call a mutation to add the driver to the business day
    //     if (selectedDriver) {
    //         addDriver(selectedDriver);
    //     }
    //     close();
    // };

    const handleChange = (drawerID: string) => {
        console.log({ drawerID });
        const driver = availableDrivers.find((d) => d.drawer_id === drawerID) as DriverDrawer;
        // setSelectedDriver(driver);
        addDriver(driver);
        close();
    };

    const handleClick = () => {
        // setSelectedDriver(null);
        open();
    };

    return (
        <>
            <DrawerCardBase
                sx={{
                    button: {
                        height: '16em',
                        width: '12em',
                    },
                    avatar: {
                        width: '6em',
                        height: '6em',
                    },
                }}
                drawer={dummyDrawer}
                handleClick={handleClick}
            />

            <Dialog open={isOpen} onClose={close}>
                <DialogTitle>Add Driver</DialogTitle>
                <DialogContent>
                    <Stack direction="row" mt={2}>
                        {mode === 'existing' && (
                            <Autocomplete
                                options={availableDrivers.map((driver) => driver.drawer_id)}
                                sx={{ width: 300 }}
                                onChange={(_, drawerID) => handleChange(drawerID || '')}
                                renderInput={(params) => <TextField {...params} label="Driver" />}
                                getOptionLabel={(option) =>
                                    availableDrivers.find((d) => d.drawer_id === option)?.name || ''
                                }
                            />
                        )}
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Button onClick={handleSubmit}>Submit</Button> */}

                    {mode === 'existing' ? (
                        <Button variant="text" onClick={() => setMode('new')}>
                            Create a New Driver
                        </Button>
                    ) : (
                        <Button variant="text" onClick={() => setMode('existing')}>
                            Select an Existing Driver
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};
