import type { BusinessDayDrawerSummary, Order_Payment } from '../../typesAndValidators';

/**
 * FAB/summary lock gate. Tickets use Order.is_locked; SpeedDial used only
 * BusinessDayDrawer.is_locked — those can briefly diverge after close (realtime).
 * Treat as locked if the summary says so OR every assigned order is locked.
 */
export const isMobileDrawerLocked = (
    summary: Pick<BusinessDayDrawerSummary, 'is_locked'> | null | undefined,
    orders: Pick<Order_Payment, 'is_locked'>[],
): boolean => {
    if (summary?.is_locked) return true;
    return orders.length > 0 && orders.every((order) => order.is_locked);
};
