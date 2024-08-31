import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllDaysDrivers } from '../../supabaseQueries';
import { useBusinessDate } from './useBusinessDate';
import { useBariPizzaContext } from './useContextData';
import { DriverDrawer } from '../../typesAndValidators';

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

    return {
        all: drivers,
        todays: todaysDrivers,
    };
};
