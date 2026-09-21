import { formatCurrency } from '../../utils';
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
    } = input;

    const closingPmt = findClosingPayment(paymentTransfers);
    const hoursDetails = formatHoursDetails(hours, hoursInCents);

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
            details: closingPmt
                ? `${CLOSING_PAYMENT_TITLE}: ${formatCurrency(closingPmt.amount_in_cents)}`
                : `No ${CLOSING_PAYMENT_TITLE}`,
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
