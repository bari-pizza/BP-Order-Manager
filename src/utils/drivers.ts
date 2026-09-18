import type { Driver_Drawer } from '../typesAndValidators';

/** Whether this driver's drawer is on today's BusinessDayDriver roster. */
export const isDriverWorkingToday = (
    todaysDrivers: Pick<Driver_Drawer, 'drawer_id'>[],
    driverDrawerId: string,
): boolean => todaysDrivers.some((d) => d.drawer_id === driverDrawerId);
