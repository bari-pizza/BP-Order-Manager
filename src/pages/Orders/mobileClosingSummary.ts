import { formatCurrency, getRunningTotal } from '../../utils';
import { CLOSING_PAYMENT_TITLE, findClosingPayment } from '../../constants/cashTransfers';
import type { CashTransfer } from '../../typesAndValidators';

export type SummaryLineItem = {
    label: string;
    value: number;
    details?: string;
};

export type MobileClosingSummaryInput = {
    totalInCents: number;
    bankInCents: number | undefined;
    hours: number;
    hoursInCents: number;
    cardBaseInCents: number;
    cardTipsInCents: number;
    thirdPartyBaseInCents: number;
    thirdPartyTipsInCents: number;
    deliveryFeesInCents: number;
    otherInCents: number;
    paymentsInCents: number;
    paymentTransfers: CashTransfer[];
    /** Current drawer id — used for Closing Payment Paid By/To wording. */
    drawerID?: string;
    /** Current drawer display name for Paid By/To. */
    drawerName?: string;
};

/** Hours popover copy — guards divide-by-zero when hours are unset. */
export const formatHoursDetails = (hours: number, hoursInCents: number): string | undefined => {
    if (hours > 0) {
        return `${hours} hours @ ${formatCurrency(hoursInCents / hours)}`;
    }
    if (hoursInCents !== 0) {
        return formatCurrency(Math.abs(hoursInCents));
    }
    return undefined;
};

export const buildMobileClosingItems = (input: MobileClosingSummaryInput): SummaryLineItem[] => {
    const {
        totalInCents,
        bankInCents,
        hours,
        hoursInCents,
        cardBaseInCents,
        cardTipsInCents,
        thirdPartyBaseInCents,
        thirdPartyTipsInCents,
        deliveryFeesInCents,
        otherInCents,
        paymentsInCents,
        paymentTransfers,
        drawerID,
        drawerName,
    } = input;

    const closingPmt = findClosingPayment(paymentTransfers);
    const hoursDetails = formatHoursDetails(hours, hoursInCents);

    let paymentsDetails = `No ${CLOSING_PAYMENT_TITLE}`;
    if (closingPmt) {
        if (drawerID && drawerName) {
            const paidByOrTo = closingPmt.source === drawerID ? 'By' : 'To';
            paymentsDetails = `${CLOSING_PAYMENT_TITLE} Paid ${paidByOrTo} ${drawerName}: ${formatCurrency(closingPmt.amount_in_cents)}`;
        } else {
            paymentsDetails = `${CLOSING_PAYMENT_TITLE}: ${formatCurrency(closingPmt.amount_in_cents)}`;
        }
    }

    return [
        { label: 'Total', value: totalInCents },
        { label: 'Bank', value: bankInCents ?? 0 },
        {
            label: 'Hours',
            value: -hoursInCents,
            ...(hoursDetails ? { details: hoursDetails } : {}),
        },
        {
            label: 'Cards',
            value: -(cardBaseInCents + cardTipsInCents),
            details: `${formatCurrency(cardBaseInCents)} base |  ${formatCurrency(cardTipsInCents)} tips`,
        },
        {
            label: '3rd Party',
            value: -(thirdPartyBaseInCents + thirdPartyTipsInCents),
            details: `${formatCurrency(thirdPartyBaseInCents)} base |  ${formatCurrency(thirdPartyTipsInCents)} tips`,
        },
        {
            label: 'Delivery Fees',
            value: -deliveryFeesInCents,
            details: '$4 per order',
        },
        { label: 'Other', value: otherInCents },
        {
            label: 'Payments',
            value: paymentsInCents,
            details: paymentsDetails,
        },
    ];
};

export const buildMobileTakeHomeItems = (input: {
    hours: number;
    hoursInCents: number;
    cashTipsInCents: number;
    cardTipsInCents: number;
    thirdPartyTipsInCents: number;
    deliveryFeesInCents: number;
}): SummaryLineItem[] => {
    const hoursDetails = formatHoursDetails(input.hours, input.hoursInCents);
    return [
        {
            label: 'Hours',
            value: input.hoursInCents,
            ...(hoursDetails ? { details: hoursDetails } : {}),
        },
        {
            label: 'Tips',
            value: input.cashTipsInCents + input.cardTipsInCents + input.thirdPartyTipsInCents,
            details: `${formatCurrency(input.cashTipsInCents)} cash | ${formatCurrency(input.cardTipsInCents)} card | ${formatCurrency(
                input.thirdPartyTipsInCents,
            )} third party`,
        },
        {
            label: 'Delivery Fees',
            value: input.deliveryFeesInCents,
            details: '$4 per order',
        },
    ];
};

/**
 * When no Closing Payment exists yet, inject a provisional Payments line that
 * zeros the outstanding (same seed math as manager Create Closing Payment).
 */
export const withProvisionalClosingPayment = (
    items: SummaryLineItem[],
    paymentTransfers: CashTransfer[],
): SummaryLineItem[] => {
    if (findClosingPayment(paymentTransfers)) return items;

    const prior = items.filter((item) => item.label !== 'Payments');
    const outstanding = prior.reduce((sum, item) => sum + item.value, 0);
    const provisional = -outstanding;

    return [
        ...prior,
        {
            label: 'Payments',
            value: provisional,
            details:
                provisional === 0
                    ? `No ${CLOSING_PAYMENT_TITLE}`
                    : `Provisional ${CLOSING_PAYMENT_TITLE}: ${formatCurrency(Math.abs(provisional))}`,
        },
    ];
};

/** Absolute closing-payment amount for the Pay the shop hero. */
export const payTheShopHeroCents = (items: SummaryLineItem[]): number => {
    const payments = items.find((item) => item.label === 'Payments');
    return Math.abs(payments?.value ?? 0);
};

/** Final running total for Take home hero. */
export const takeHomeHeroCents = (items: SummaryLineItem[]): number => {
    if (items.length === 0) return 0;
    const running = getRunningTotal(items.map((item) => item.value));
    return running[running.length - 1] ?? 0;
};
