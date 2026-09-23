import { describe, expect, it } from 'vitest';
import {
    CLOSING_PAYMENT_TITLE,
    collapsedTransferLabel,
    countClosingPayments,
    findClosingPayment,
    getClosingTotalPayments,
    humanizeTransferType,
    isClosingPaymentTitle,
} from '../../src/constants/cashTransfers';
import { formatHoursDetails, buildMobileClosingItems, withProvisionalClosingPayment, payTheShopHeroCents, takeHomeHeroCents, buildMobileTakeHomeItems } from '../../src/pages/Orders/mobileClosingSummary';
import type { CashTransfer } from '../../src/typesAndValidators';

const base = (overrides: Partial<CashTransfer>): CashTransfer => ({
    cash_transfer_id: 'x',
    created_at: '2026-09-20T12:00:00.000Z',
    business_date: '2026-09-20',
    amount_in_cents: 1000,
    source: 'a',
    destination: 'b',
    title: '',
    special_note: '',
    transfer_type: 'payment',
    ...overrides,
});

describe('cashTransfers closing payment helpers', () => {
    it('matches Closing Payment case-insensitively', () => {
        expect(isClosingPaymentTitle('Closing Payment')).toBe(true);
        expect(isClosingPaymentTitle('closing payment')).toBe(true);
        expect(isClosingPaymentTitle('Bank Transfer')).toBe(false);
    });

    it('findClosingPayment returns earliest when duplicates exist', () => {
        const early = base({
            cash_transfer_id: '1',
            created_at: '2026-09-20T10:00:00.000Z',
            title: CLOSING_PAYMENT_TITLE,
            amount_in_cents: 4000,
        });
        const late = base({
            cash_transfer_id: '2',
            created_at: '2026-09-20T22:00:00.000Z',
            title: CLOSING_PAYMENT_TITLE,
            amount_in_cents: 1000,
        });
        expect(findClosingPayment([late, early])?.cash_transfer_id).toBe('1');
        expect(countClosingPayments([late, early])).toBe(2);
    });

    it('retains ordinary payments but only the earliest Closing Payment for closing totals', () => {
        const ordinary = base({ cash_transfer_id: 'ordinary', title: 'Driver payment' });
        const early = base({
            cash_transfer_id: 'early',
            created_at: '2026-09-20T10:00:00.000Z',
            title: CLOSING_PAYMENT_TITLE,
        });
        const late = base({
            cash_transfer_id: 'late',
            created_at: '2026-09-20T22:00:00.000Z',
            title: CLOSING_PAYMENT_TITLE,
        });

        expect(getClosingTotalPayments([ordinary, late, early]).map((payment) => payment.cash_transfer_id)).toEqual([
            'ordinary',
            'early',
        ]);
    });
});

describe('formatHoursDetails', () => {
    it('formats rate when hours > 0', () => {
        expect(formatHoursDetails(5, 2500)).toMatch(/5 hours/);
    });

    it('does not divide by zero when hours are 0', () => {
        expect(formatHoursDetails(0, 2500)).toBeTruthy();
        expect(() => formatHoursDetails(0, 0)).not.toThrow();
        expect(formatHoursDetails(0, 0)).toBeUndefined();
    });
});

describe('buildMobileClosingItems', () => {
    it('uses details (not detail) for Hours so SummaryStack shows the popover', () => {
        const items = buildMobileClosingItems({
            totalInCents: 100,
            bankInCents: 20,
            hours: 2,
            hoursInCents: 1000,
            cardBaseInCents: 0,
            cardTipsInCents: 0,
            thirdPartyBaseInCents: 0,
            thirdPartyTipsInCents: 0,
            deliveryFeesInCents: 0,
            otherInCents: 0,
            paymentsInCents: 0,
            paymentTransfers: [],
        });
        const hoursLine = items.find((i) => i.label === 'Hours');
        expect(hoursLine?.details).toBeDefined();
        expect(hoursLine).not.toHaveProperty('detail');
    });
});

describe('transfer type labels', () => {
    it('humanizes enums', () => {
        expect(humanizeTransferType('bank')).toBe('Bank');
        expect(humanizeTransferType('payment')).toBe('Payment');
        expect(humanizeTransferType('other')).toBe('Other');
    });

    it('prefers title on collapsed rows, else humanized type', () => {
        expect(collapsedTransferLabel({ title: 'Gas', transfer_type: 'other' })).toBe('Gas');
        expect(collapsedTransferLabel({ title: '', transfer_type: 'payment' })).toBe('Payment');
        expect(collapsedTransferLabel({ title: '  ', transfer_type: 'bank' })).toBe('Bank');
    });
});

describe('mobile closing Paid By/To', () => {
    it('matches desktop Closing Payment Paid By/To wording', () => {
        const closing = base({
            cash_transfer_id: 'close',
            title: CLOSING_PAYMENT_TITLE,
            source: 'driver-1',
            destination: 'register-1',
            amount_in_cents: 4500,
        });
        const items = buildMobileClosingItems({
            totalInCents: 100,
            bankInCents: 20,
            hours: 2,
            hoursInCents: 1000,
            cardBaseInCents: 0,
            cardTipsInCents: 0,
            thirdPartyBaseInCents: 0,
            thirdPartyTipsInCents: 0,
            deliveryFeesInCents: 0,
            otherInCents: 0,
            paymentsInCents: -4500,
            paymentTransfers: [closing],
            drawerID: 'driver-1',
            drawerName: 'Alex',
        });
        const payments = items.find((i) => i.label === 'Payments');
        expect(payments?.details).toContain('Paid By Alex');
    });
});

describe('provisional Closing Payment (BAR-48)', () => {
    const baseClosingInput = {
        totalInCents: 310_00,
        bankInCents: 100_00,
        hours: 5,
        hoursInCents: 75_00,
        cardBaseInCents: 180_00,
        cardTipsInCents: 30_00,
        thirdPartyBaseInCents: 30_00,
        thirdPartyTipsInCents: 10_00,
        deliveryFeesInCents: 16_00,
        otherInCents: 0,
        paymentsInCents: 0,
        paymentTransfers: [] as CashTransfer[],
    };

    it.each([0, 1000, -1000, -10000])('retains ordinary Payments and offsets the full outstanding for %i cents', (paymentsInCents) => {
        const raw = buildMobileClosingItems({ ...baseClosingInput, paymentsInCents });
        const withProv = withProvisionalClosingPayment(raw, []);
        const payments = withProv.find((i) => i.label === 'Payments');
        const provisional = withProv.find((i) => i.label === CLOSING_PAYMENT_TITLE);
        const outstanding = raw.reduce((sum, i) => sum + i.value, 0);
        expect(payments).toEqual(raw.find((i) => i.label === 'Payments'));
        expect(withProv.slice(0, -1)).toEqual(raw);
        expect(provisional?.value).toBe(-outstanding);
        expect(provisional?.details).toMatch(/Provisional/);
        expect(withProv.reduce((sum, i) => sum + i.value, 0)).toBe(0);
        expect(payTheShopHeroCents(withProv)).toBe(-outstanding);
    });

    it('leaves saved Closing Payment lines unchanged', () => {
        const closing = base({
            cash_transfer_id: 'close',
            title: CLOSING_PAYMENT_TITLE,
            source: 'driver-1',
            amount_in_cents: 4200,
        });
        const raw = buildMobileClosingItems({
            ...baseClosingInput,
            paymentsInCents: -4200,
            paymentTransfers: [closing],
            drawerID: 'driver-1',
            drawerName: 'Alex',
        });
        const withProv = withProvisionalClosingPayment(raw, [closing]);
        expect(withProv).toBe(raw);
        expect(withProv.find((i) => i.label === 'Payments')?.value).toBe(-4200);
        expect(withProv.find((i) => i.label === 'Payments')?.details).toContain('Paid By');
        expect(payTheShopHeroCents(withProv)).toBe(-4200);
        expect(payTheShopHeroCents([{ label: 'Payments', value: 4200 }])).toBe(4200);
    });

    it('take-home hero is the final running total', () => {
        const items = buildMobileTakeHomeItems({
            hours: 5,
            hoursInCents: 75_00,
            cashTipsInCents: 12_00,
            cardTipsInCents: 28_00,
            thirdPartyTipsInCents: 8_00,
            deliveryFeesInCents: 16_00,
        });
        expect(takeHomeHeroCents(items)).toBe(75_00 + 12_00 + 28_00 + 8_00 + 16_00);
    });
});
