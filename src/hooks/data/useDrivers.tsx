import { useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { addDriverToBusinessDay, getAllDaysDrivers } from '../../supabaseQueries';
import { useBusinessDate } from './useBusinessDate';
import { useBariPizzaContext } from './useContextData';
import { DriverDrawer } from '../../typesAndValidators';
import dayjs from 'dayjs';

export const useDrivers = () => {
    const [businessDate] = useBusinessDate();
    const { drivers } = useBariPizzaContext();
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businessDayDrivers', businessDate.format('YYYY-MM-DD')] });
        },
    });

    const addDriver = (driver: DriverDrawer) => {
        const drawerID = driver.drawer_id;
        addDriverToDayMutation.mutate({ drawerID, businessDate });
    };

    const removeDriver = (driver: DriverDrawer) => {
        const drawerID = driver.drawer_id;
        console.log('removing driver', drawerID);
        // TODO:
        // removeDriverFromDayMutation.mutate({ drawerID, businessDate });
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
