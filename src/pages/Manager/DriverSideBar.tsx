import { Button, Stack, TextField, Typography } from '@mui/material';
import { useBariPizzaContext, useManagerDashboardContext } from '../../hooks/data/useContextData';
import { SideBar } from '../../components/SideBar';
import { DrawerCardSlotProps } from '../../components/Base/DrawerCardBase';
import { ContextMenu } from '../../components/Base/ContextMenu';
import { DriverCard } from './DriverCard';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import TextFieldWithMask from '../../rickcedlib/TextFieldWithMask';

// TODO: ***NEXT*** create new BusinessDayDrawer table
// pk (drawer_id, business_date), bank, hours, other, is_locked, is_closed, special_note

type FormValues = {
    bank: number;
    hours: number;
    other: number;
};

export const DriverSideBar = () => {
    const { constants } = useBariPizzaContext();
    const { orders, drivers } = useManagerDashboardContext();
    const currentDriver = drivers.current;

    const { control, handleSubmit, register } = useForm<FormValues>({
        defaultValues: {
            // eventually get this from BusinessDayDriver table
            bank: constants.default.starting_cash_in_cents,
            hours: 0,
            other: 0,
        },
    });

    if (!currentDriver) {
        return null;
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };

    const driversOrders = orders.byDrawerID(currentDriver.drawer_id);
    const driverSummary = {
        total_in_cents: 0,
        orders: 0,
        cash: 0,
        credit: 0,
    };
    driversOrders.forEach((order) => {
        driverSummary.total_in_cents += order.total_in_cents;
        driverSummary.orders += 1;
        // driverSummary.cash += order.cash;
        // driverSummary.credit += order.credit;
    });

    const sx = {
        avatar: {
            width: '6em',
            height: '6em',
        },
        avatarIcon: {
            width: '4em',
            height: '4em',
        },
        button: {
            height: '12em',
            width: '300px',
            '&.open-drawer': {
                backgroundColor: 'orange',
            },
        },
    };

    const props: DrawerCardSlotProps = {
        button: { variant: 'text', disabled: true, disableRipple: true },
        buttonStack: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
        nameTypography: { variant: 'h6' },
    };

    return (
        <SideBar width="350px">
            <Stack direction="column" height="100vh" spacing={2} alignItems="center" mt={2}>
                <Stack direction="column" alignItems="center" gap={2}>
                    <ContextMenu openOnType="click">
                        <ContextMenu.Base>
                            <DriverCard driver={currentDriver} sx={sx} props={props} canOpen={false} />
                        </ContextMenu.Base>
                        <DriverCard.contextMenu driver={currentDriver} />
                    </ContextMenu>
                    <Typography variant="h6">ORDERS: {driverSummary.orders}</Typography>
                    <Typography variant="h6">TOTAL: ${(driverSummary.total_in_cents / 100).toFixed(2)}</Typography>
                    <Controller
                        name="bank"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextFieldWithMask
                                label="Bank"
                                maskVariant="currency"
                                value={value}
                                onChange={onChange}
                                keepMask={true}
                            />
                        )}
                    />
                    <TextField label="Hours" {...register('hours')} />
                    <Controller
                        name="other"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextFieldWithMask
                                label="Other"
                                maskVariant="currency"
                                value={value}
                                onChange={onChange}
                                keepMask={true}
                            />
                        )}
                    />
                    <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                    <Button>Close Driver</Button>
                </Stack>
            </Stack>
        </SideBar>
    );
};
