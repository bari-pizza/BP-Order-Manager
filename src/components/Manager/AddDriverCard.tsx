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
import { Controller, useForm } from 'react-hook-form';

interface AddDriverCardProps {
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

export const AddDriverCard = ({ open, close, isOpen }: AddDriverCardProps) => {
    const { drivers } = useManagerDashboardContext();
    const { available: availableDrivers } = drivers;
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

    const closeDialog = () => {
        setMode('existing');
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

    return (
        <>
            <DrawerCardBase sx={sx} drawer={dummyDrawer} handleClick={handleClick} />
            <Dialog open={isOpen} onClose={closeDialog}>
                {mode === 'existing' ? (
                    <ChooseExistingDriverForm setMode={setMode} closeDialog={closeDialog} />
                ) : (
                    <CreateNewDriverForm setMode={setMode} closeDialog={closeDialog} />
                )}
            </Dialog>
        </>
    );
};

interface FormProps {
    setMode: (mode: 'existing' | 'new') => void;
    closeDialog: () => void;
}

const ChooseExistingDriverForm = ({ setMode, closeDialog }: FormProps) => {
    const { drivers } = useManagerDashboardContext();
    const { available: availableDrivers, add: addDriver } = drivers;
    const [selectedDriver, setSelectedDriver] = useState<DriverDrawer | null>(null);

    const handleChange = (drawerID: string) => {
        console.log({ drawerID });
        const driver = availableDrivers.find((d) => d.drawer_id === drawerID) as DriverDrawer;
        setSelectedDriver(driver);
    };

    const handleChooseExistingDriver = () => {
        addDriver(selectedDriver as DriverDrawer);
        setSelectedDriver(null);
        closeDialog();
    };

    return (
        <>
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
                    <Button variant="text" onClick={() => setMode('new')}>
                        Create a New Driver
                    </Button>
                </Stack>
            </DialogActions>
        </>
    );
};

const CreateNewDriverForm = ({ setMode, closeDialog }: FormProps) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
    });

    const onSubmit = (data: unknown) => {
        console.log(data);
        closeDialog();
    };

    return (
        <>
            <DialogTitle sx={{ textAlign: 'center' }}>Create Driver</DialogTitle>
            <DialogContent>
                <Stack direction="column" mt={2} gap={2}>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => <TextField {...field} label="First Name" />}
                    />
                    <TextField label="Last Name" />
                    <TextField label="Email" />
                    <TextField label="Phone" />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '1em' }}>
                <Stack direction="column" gap={2} mb={2}>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                        Create New Driver
                    </Button>
                    <Divider />
                    <Button variant="text" onClick={() => setMode('existing')}>
                        Select an Existing Driver
                    </Button>
                </Stack>
            </DialogActions>
        </>
    );
};
