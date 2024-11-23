import { useBusinessDate } from './useBusinessDate';
import { useBariPizzaContext, useLayoutContext, useUserContext } from './useContextData';
// import { useRef } from 'react';
import { useOrdersDrawersTickets } from './useOrdersDrawersTickets';

export const useMobile = () => {
    const [businessDate] = useBusinessDate();
    const { isMobile } = useLayoutContext();
    const { profile } = useUserContext();
    const { drivers, drawers, origins, constants } = useBariPizzaContext();
    const { orders, ticket } = useOrdersDrawersTickets();
    // const toastRef = useRef<{
    //     [toastID: string]: ({ data, errors, forEachError }: HandleOutcomeProps) => void;
    // }>({});

    if (!isMobile) {
        return {
            businessDate,
            profile,
            driver: undefined,
            drawers: drawers, // non-driver drawers
            origins: origins,
            constants: constants,
            orders: [],
            ticket,
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
            ticket,
        };

    const driversOrders = orders.byDrawerID(driver.drawer_id);

    /* TODO: drivers need to be able to:

        - add orders
            - origin
            - drawer (self)
            - order type (delivery)
            - order #/name
            - delivery fee (default)
            - total

        - update orders
            - origin
            - order #/name
            - total

        - request to delete orders

        - add payments
            - payment type
            - amount
            - tip

        - update payments
            - payment type
            - amount
            - tip

        - delete payments



        - access end of day payment slip

    */

    return {
        businessDate,
        profile,
        driver,
        drawers: drawers, // non-driver drawers
        origins: origins,
        constants: constants,
        orders: driversOrders,
        ticket,
    };
};
