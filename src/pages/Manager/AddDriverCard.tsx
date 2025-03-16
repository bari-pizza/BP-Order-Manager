import { useBariPizzaContext, useManagerDashboardContext } from '../../hooks/data/useContextData';
import { Driver_Drawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../../components/Base/DrawerCardBase';
import { Dialog, Autocomplete, Button, DialogTitle, DialogContent, DialogActions, Stack, Divider } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import TextFieldWithMask from '../../rickcedlib/components/TextFieldWithMask';
import dayjs from 'dayjs';
import { SmartTextField } from '../../rickcedlib/components/SmartTextField';

interface AddDriverCardProps {
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

export const AddDriverCard = ({ open, close, isOpen }: AddDriverCardProps) => {
    const { resources } = useBariPizzaContext();
    const { drivers, cashTransfers } = useManagerDashboardContext();
    const { constants, drawers } = useBariPizzaContext();
    const { available: availableDrivers, add: addDriver } = drivers;
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            driverID: '',
            bank_in_cents: constants.default.driver_starting_cash_in_cents,
            bank_register: constants.default.register_for_bank_transfers,
        },
    });

    const resource = resources.find((r) => r.title === 'Add Driver');

    const dummyDrawer: Driver_Drawer = {
        created_at: '2024-08-27T00:00:00.000Z',
        drawer_id: 'add-driver',
        drawer_type: 'driver',
        name: 'Add Driver',
        is_deleted: false,
        driver: {
            id: '3',
            email: 'vI8Pb@example.com',
            first_name: 'Add',
            is_admin: false,
            is_manager: false,
            is_cashier: false,
            last_name: 'Driver',
            phone: '555-555-5555',
            avatar_src: resource?.src || '',
            is_deleted: false,
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

    const driverID = watch('driverID');

    const onSubmit = ({
        driverID,
        bank_in_cents,
        bank_register,
    }: {
        driverID: string;
        bank_in_cents: number;
        bank_register: string;
    }) => {
        const selectedDriver = availableDrivers.find((d) => d.drawer_id === driverID) as Driver_Drawer;
        addDriver(selectedDriver);
        if (bank_in_cents > 0) {
            cashTransfers.create({
                amount_in_cents: bank_in_cents,
                business_date: dayjs().format('YYYY-MM-DD'),
                destination: selectedDriver.drawer_id,
                source: bank_register,
                special_note: '',
                title: 'Bank Transfer',
                transfer_type: 'bank',
            });
        }
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
                            <Controller
                                name="driverID"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <Autocomplete
                                        options={availableDrivers.map((driver) => driver.drawer_id)}
                                        sx={{ width: 225 }}
                                        onChange={(_, drawerID) => onChange(drawerID || '')}
                                        renderInput={(params) => <SmartTextField {...params} label="Driver" />}
                                        getOptionLabel={(option) =>
                                            availableDrivers.find((d) => d.drawer_id === option)?.name || ''
                                        }
                                    />
                                )}
                            />
                        ) : (
                            <SmartTextField label="No Drivers Available" disabled />
                        )}
                    </Stack>
                    <Divider />
                    {driverID && (
                        <Stack direction="column" mt={2} gap={2}>
                            <Controller
                                name="bank_register"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Autocomplete
                                        options={drawers
                                            .filter((drawer) => drawer.drawer_type === 'register')
                                            .map((drawer) => drawer.drawer_id)}
                                        value={value}
                                        sx={{ width: 225 }}
                                        onChange={(_, drawerID) => onChange(drawerID || '')}
                                        renderInput={(params) => <SmartTextField {...params} label="Register" />}
                                        getOptionLabel={(option) =>
                                            drawers.find((d) => d.drawer_id === option)?.name || ''
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="bank_in_cents"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextFieldWithMask
                                        label="Bank"
                                        maskVariant="currency"
                                        value={value}
                                        handleChange={onChange}
                                        error={!!errors.bank_in_cents}
                                        helperText={errors.bank_in_cents?.message}
                                    />
                                )}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '1em' }}>
                    <Stack direction="column" gap={2} mb={2}>
                        {/* <Button variant="contained" onClick={handleChooseExistingDriver} disabled={!selectedDriver}> */}
                        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={!driverID}>
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
