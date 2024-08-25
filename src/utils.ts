import { Drawer, DriverDrawer } from './typesAndValidators';
import dayjs from 'dayjs';

export const getDrawerFullName = (drawer: Drawer | DriverDrawer) => {
    if ('driver' in drawer) {
        return `${drawer.driver.first_name} ${drawer.driver.last_name}`;
    }
    return drawer.name;
};

export const dayjsToMDY = (date: dayjs.Dayjs) => {
    const month = date.month() + 1;
    const day = date.date();
    const year = date.year();
    return { month, day, year };
};
