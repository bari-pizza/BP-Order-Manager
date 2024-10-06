import { useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { addDriverToBusinessDay, getAllDaysDrivers, removeDriverFromBusinessDay } from '../../supabaseQueries';
import { useBusinessDate } from './useBusinessDate';
import { useBariPizzaContext } from './useContextData';
import { Driver_Drawer } from '../../typesAndValidators';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { DataWithError, HandleOutcomeProps } from '../../toast/toast';
import { addDriverToBusinessDayToast, removeDriverFromBusinessDayToast } from '../../toast/driversToast';

export const useDrivers = () => {
    const [businessDate] = useBusinessDate();
    const { drivers } = useBariPizzaContext();
    const toastRef = useRef<{
        [orderID: string]: ({ data, errors, forEachError }: HandleOutcomeProps) => void;
    }>({});
    const { data: businessDayDrivers } = useSuspenseQuery({
        queryKey: ['businessDayDrivers', businessDate.format('YYYY-MM-DD')],
        queryFn: () => getAllDaysDrivers(businessDate),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
    const todaysDrivers = businessDayDrivers
        .map(({ drawer_id }) => {
            return drivers.find((driver) => driver.drawer_id === drawer_id);
        })
        .filter((driver) => driver !== undefined) as Driver_Drawer[];
    const [openDriver, setOpenDriver] = useState<Driver_Drawer | null>(todaysDrivers[0] || null);

    const availableDrivers =
        drivers.filter((driver) => {
            return !todaysDrivers.some((todaysDriver) => todaysDriver.drawer_id === driver.drawer_id);
        }) || [];

    const queryClient = useQueryClient();

    const addDriverToDayMutation = useMutation({
        mutationFn: ({ drawerID, businessDate }: { drawerID: string; businessDate: dayjs.Dayjs }) =>
            addDriverToBusinessDay({ drawerID, businessDate }),
        onSuccess: (data) => {
            const handleOutcome = toastRef.current['add'];
            handleOutcome({ data: data as unknown as DataWithError });
            queryClient.invalidateQueries({ queryKey: ['businessDayDrivers', businessDate.format('YYYY-MM-DD')] });
        },
        onError: (error) => {
            const handleOutcome = toastRef.current['add'];
            const errors = [error as unknown as DataWithError];
            handleOutcome({ data: null, errors });
        },
    });

    const removeDriverFromDayMutation = useMutation({
        mutationFn: ({ drawerID, businessDate }: { drawerID: string; businessDate: dayjs.Dayjs }) =>
            removeDriverFromBusinessDay({ drawerID, businessDate }),
        onSuccess: (data) => {
            console.log({ data });
            queryClient.invalidateQueries({ queryKey: ['businessDayDrivers', businessDate.format('YYYY-MM-DD')] });
            const handleOutcome = toastRef.current['remove'];
            handleOutcome({ data: data as unknown as DataWithError });
        },
        onError: (error) => {
            const handleOutcome = toastRef.current['remove'];
            const errors = [error as unknown as DataWithError];
            handleOutcome({ data: null, errors });
        },
    });

    const addDriver = (driver: Driver_Drawer) => {
        // should create a bank transfer as well
        const drawerID = driver.drawer_id;
        toastRef.current['add'] = addDriverToBusinessDayToast(driver.name, businessDate);
        addDriverToDayMutation.mutate({ drawerID, businessDate });
    };

    const removeDriver = (driver: Driver_Drawer) => {
        // should delete a bank transfer as well
        const drawerID = driver.drawer_id;
        toastRef.current['remove'] = removeDriverFromBusinessDayToast(driver.name, businessDate);
        removeDriverFromDayMutation.mutate({ drawerID, businessDate });
        if (openDriver?.drawer_id === driver.drawer_id) {
            setOpenDriver(null);
        }
    };

    const handleDriverClick = (driver: Driver_Drawer) => {
        if (openDriver?.drawer_id === driver.drawer_id) {
            setOpenDriver(null);
        } else {
            setOpenDriver(driver);
        }
    };

    return {
        drivers: {
            all: drivers,
            todays: todaysDrivers,
            available: availableDrivers,
            current: openDriver,
            handleClick: handleDriverClick,
            add: addDriver,
            remove: removeDriver,
        },
    };
};
