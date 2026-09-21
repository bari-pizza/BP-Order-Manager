import type { CashTransfer, CashTransferType } from '../typesAndValidators';

/** Canonical title for the auto-created drawer-close settlement payment. */
export const CLOSING_PAYMENT_TITLE = 'Closing Payment';

export const TRANSFER_TYPE_LABELS: Record<CashTransferType, string> = {
    bank: 'Bank',
    payment: 'Payment',
    other: 'Other',
};

export const DIRECTION_LABELS: Record<'to' | 'from' | 'spent' | 'received', string> = {
    to: 'To',
    from: 'From',
    spent: 'Spent',
    received: 'Received',
};

export const humanizeTransferType = (type: CashTransferType | string): string =>
    TRANSFER_TYPE_LABELS[type as CashTransferType] ?? type;

export const collapsedTransferLabel = (transfer: Pick<CashTransfer, 'title' | 'transfer_type'>): string => {
    const title = transfer.title?.trim();
    if (title) return title;
    return humanizeTransferType(transfer.transfer_type);
};

export const isClosingPaymentTitle = (title: string | null | undefined): boolean =>
    (title ?? '').trim().toLowerCase() === CLOSING_PAYMENT_TITLE.toLowerCase();

/**
 * Prefer the earliest Closing Payment when duplicates exist.
 * Callers should surface a warning when `countClosingPayments` > 1.
 */
export const findClosingPayment = (payments: CashTransfer[]): CashTransfer | undefined => {
    const matches = payments
        .filter((pmt) => isClosingPaymentTitle(pmt.title))
        .slice()
        .sort((a, b) => a.created_at.localeCompare(b.created_at));
    return matches[0];
};

/**
 * Retain every ordinary payment and only the canonical Closing Payment for drawer-close totals.
 */
export const getClosingTotalPayments = (payments: CashTransfer[]): CashTransfer[] => {
    const closingPayment = findClosingPayment(payments);
    return payments.filter((payment) => !isClosingPaymentTitle(payment.title) || payment === closingPayment);
};

export const countClosingPayments = (payments: CashTransfer[]): number =>
    payments.filter((pmt) => isClosingPaymentTitle(pmt.title)).length;
