import { useBusinessDate } from './useBusinessDate';
import { useBariPizzaContext, useLayoutContext, useUserContext } from './useContextData';
import { useDrivers } from './useDrivers';
// import { useRef } from 'react';
import { useOrdersDrawersTickets } from './useOrdersDrawersTickets';

/* TODO: Finishing Touches

    [ ] add something at the top of the screen (Business Date!)
    [ ] fix scrolling in orders area
    [x] Add a way for admin to create a new driver
    [x] Send password reset email
    [ ] Add a way to update your password
    [ ] Choose a prettier secondary color
    [x] - info telling manager to delete order they must first:
            - delete all payments
            - unassign from any drawers
    [ ] - figure out visual bug with lock icon badge (color sometimes showing)
    [ ] - fix several warnings in console
        [ ] - react router future
    [ ] - MUI Data Grid - space between table and footer takes an instant to disappear
    [ ] - separate skeletons for mobile and desktop
    [ ] - order ticket stretches when a row is added or removed from order ticket area (motion issues)
    [ ] - add new lottie icons
        [ ] - For tabs (Orders, Drivers, Cards, Sales)
    [ ] - check issues with subscriptions
        [ ] - mobile is not seeing new orders applied
        [ ] - not all changes to orders are being shown to a second instance of desktop
        */

export const useMobile = () => {
    const [businessDate] = useBusinessDate();
    const { isMobile } = useLayoutContext();
    const { profile } = useUserContext();
    const {
        drivers: { todays: todaysDrivers },
    } = useDrivers();
    const { drivers, drawers, origins, constants } = useBariPizzaContext();
    const { orders, ticket, summaries, cashTransfers } = useOrdersDrawersTickets();

    if (!isMobile) {
        return {
            businessDate,
            profile,
            driver: undefined,
            drawers: drawers, // non-driver drawers
            origins: origins,
            constants,
            orders: [],
            isRepeat: () => false,
            ticket,
            driverIsWorkingToday: false,
            summary: undefined,
            cashTransfers: [],
        };
    }

    const driver = drivers.find((driver) => driver.driver.id === profile?.id);

    if (!driver)
        return {
            businessDate,
            profile,
            driver,
            drawers: drawers, // non-driver drawers
            origins: origins,
            constants: constants,
            orders: [],
            isRepeat: () => false,
            ticket,
            driverIsWorkingToday: false,
            summary: undefined,
            cashTransfers: [],
        };

    const driverIsWorkingToday = todaysDrivers.some((driver) => driver.drawer_id === driver.drawer_id);

    if (!driverIsWorkingToday) {
        return {
            businessDate,
            profile,
            driver,
            drawers: drawers, // non-driver drawers
            origins: origins,
            constants: constants,
            orders: [],
            isRepeat: () => false,
            ticket,
            driverIsWorkingToday,
            summary: undefined,
            cashTransfers: [],
        };
    }

    const driversOrders = orders.byDrawerID(driver.drawer_id);
    const driverCashTransfers = cashTransfers.byDrawerID(driver.drawer_id);

    return {
        businessDate,
        profile,
        driver,
        drawers: drawers, // non-driver drawers
        origins: origins,
        constants: constants,
        orders: driversOrders,
        isRepeat: orders.isRepeat,
        ticket,
        driverIsWorkingToday,
        summary: summaries.byDrawerID(driver.drawer_id),
        cashTransfers: driverCashTransfers,
    };
};
