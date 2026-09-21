import { ManagerDashboardContext } from '../../src/context/ManagerDashboardContext';
import { createContextDecorator } from '.';
import { dummyDrawers } from '../../src/dummyData';
import { storyOriginsList } from '../fixtures/resources';
import type { CashTransfer } from '../../src/typesAndValidators';
import { CLOSING_PAYMENT_TITLE } from '../../src/constants/cashTransfers';
import dayjs from 'dayjs';

const { drawers, drivers } = dummyDrawers;
const register = drawers[0];
const driver = drivers[0];

export const storyCashTransfers: CashTransfer[] = [
    {
        cash_transfer_id: 'ct-bank-1',
        created_at: '2026-09-20T12:00:00.000Z',
        business_date: '2026-09-20',
        amount_in_cents: 2000,
        source: register.drawer_id,
        destination: driver.drawer_id,
        title: 'Bank Transfer',
        special_note: '',
        transfer_type: 'bank',
    },
    {
        cash_transfer_id: 'ct-close-1',
        created_at: '2026-09-20T22:00:00.000Z',
        business_date: '2026-09-20',
        amount_in_cents: 4500,
        source: driver.drawer_id,
        destination: register.drawer_id,
        title: CLOSING_PAYMENT_TITLE,
        special_note: '',
        transfer_type: 'payment',
    },
    {
        cash_transfer_id: 'ct-other-1',
        created_at: '2026-09-20T18:00:00.000Z',
        business_date: '2026-09-20',
        amount_in_cents: 800,
        source: driver.drawer_id,
        destination: null,
        title: 'Gas',
        special_note: '',
        transfer_type: 'other',
    },
];

/** Second Closing Payment — stories that show the duplicate warning. */
export const duplicateClosingPayment: CashTransfer = {
    cash_transfer_id: 'ct-close-dup',
    created_at: '2026-09-20T22:30:00.000Z',
    business_date: '2026-09-20',
    amount_in_cents: 1000,
    source: driver.drawer_id,
    destination: register.drawer_id,
    title: CLOSING_PAYMENT_TITLE,
    special_note: '',
    transfer_type: 'payment',
};

const byDrawer = (drawerID: string, all: CashTransfer[]) => ({
    bank: all.filter(
        (t) => t.transfer_type === 'bank' && (t.source === drawerID || t.destination === drawerID),
    ),
    payment: all.filter(
        (t) => t.transfer_type === 'payment' && (t.source === drawerID || t.destination === drawerID),
    ),
    other: all.filter(
        (t) => t.transfer_type === 'other' && (t.source === drawerID || t.destination === drawerID),
    ),
});

export const buildManagerDashboardValue = (opts?: {
    cashTransfers?: CashTransfer[];
    onCreate?: (ct: Omit<CashTransfer, 'cash_transfer_id' | 'created_at'>) => void;
}) => {
    const all = opts?.cashTransfers ?? storyCashTransfers;
    return {
        drawers: {
            all: drawers,
            onClick: () => {},
            current: driver,
            close: () => {},
            reOpen: () => {},
        },
        origins: storyOriginsList,
        drivers: {
            all: drivers,
            todays: drivers.slice(0, 2),
            available: drivers.slice(2, 4),
            current: driver,
            add: () => {},
            remove: () => {},
            handleClick: () => {},
        },
        summaries: {
            all: [],
            forCurrentDrawer: null,
            byDrawerID: () => null,
            update: () => {},
            updateAsync: async () => {},
            isUpdating: false,
        },
        cashTransfers: {
            all,
            create: (ct: Omit<CashTransfer, 'cash_transfer_id' | 'created_at'>) => {
                opts?.onCreate?.(ct);
            },
            delete: () => {},
            forCurrentDrawer: byDrawer(driver.drawer_id, all),
            byDrawerID: (id: string) => byDrawer(id, all),
            update: () => {},
        },
        combinedDrawersAndDrivers: [...drawers, ...drivers],
        orders: {
            all: [],
            forCurrentDrawer: [],
            byDrawerID: () => [],
            delete: () => {},
        },
        businessDay: {
            isLocked: false,
            reopen: () => {},
            close: () => {},
        },
    };
};

export const managerDashboardDecorators = {
    default: createContextDecorator(ManagerDashboardContext, buildManagerDashboardValue()),
    withDuplicates: createContextDecorator(
        ManagerDashboardContext,
        buildManagerDashboardValue({ cashTransfers: [...storyCashTransfers, duplicateClosingPayment] }),
    ),
};

/** Fixed business date for Add Driver / cash transfer stories (not calendar today). */
export const STORY_BUSINESS_DATE = dayjs('2026-09-15');
