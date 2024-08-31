import { useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { addDriverToBusinessDay, getAllDaysDrivers, removeDriverFromBusinessDay } from '../../supabaseQueries';
import { useBusinessDate } from './useBusinessDate';
import { useBariPizzaContext } from './useContextData';
import { DriverDrawer } from '../../typesAndValidators';
import dayjs from 'dayjs';
import { useRef } from 'react';
import {
    DataWithError,
    HandleOutcomeProps,
    addDriverToBusinessDayToast,
    removeDriverFromBusinessDayToast,
} from '../../helpers/toast';

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
        .filter((driver) => driver !== undefined) as DriverDrawer[];

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

    const addDriver = (driver: DriverDrawer) => {
        const drawerID = driver.drawer_id;
        toastRef.current['add'] = addDriverToBusinessDayToast(driver.name, businessDate);
        addDriverToDayMutation.mutate({ drawerID, businessDate });
    };

    const removeDriver = (driver: DriverDrawer) => {
        const drawerID = driver.drawer_id;
        toastRef.current['remove'] = removeDriverFromBusinessDayToast(driver.name, businessDate);
        removeDriverFromDayMutation.mutate({ drawerID, businessDate });
    };

    return {
        drivers: {
            all: drivers,
            todays: todaysDrivers,
            add: addDriver,
            remove: removeDriver,
        },
    };
};
