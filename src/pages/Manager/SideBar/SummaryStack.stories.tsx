import type { Meta, StoryObj } from '@storybook/react';
import { Alert, Stack, Typography } from '@mui/material';
import { SummaryStack } from './SummaryStack';
import {
    buildMobileClosingItems,
    buildMobileTakeHomeItems,
} from '../../Orders/mobileClosingSummary';
import { CLOSING_PAYMENT_TITLE, countClosingPayments } from '../../../constants/cashTransfers';
import {
    duplicateClosingPayment,
    storyCashTransfers,
} from '../../../../.storybook/contextDecorators/managerDashboardDecorators';

const sampleClosing = buildMobileClosingItems({
    totalInCents: 128_00,
    bankInCents: 20_00,
    hours: 5,
    hoursInCents: 25_00,
    cardBaseInCents: 40_00,
    cardTipsInCents: 8_00,
    thirdPartyBaseInCents: 15_00,
    thirdPartyTipsInCents: 3_00,
    deliveryFeesInCents: 12_00,
    otherInCents: -8_00,
    paymentsInCents: -45_00,
    paymentTransfers: storyCashTransfers.filter((t) => t.transfer_type === 'payment'),
});

const sampleTakeHome = buildMobileTakeHomeItems({
    hours: 5,
    hoursInCents: 25_00,
    cashTipsInCents: 12_00,
    cardTipsInCents: 8_00,
    thirdPartyTipsInCents: 3_00,
    deliveryFeesInCents: 12_00,
});

/** Hours unset — details should not divide by zero. */
const hoursUnsetClosing = buildMobileClosingItems({
    totalInCents: 50_00,
    bankInCents: 20_00,
    hours: 0,
    hoursInCents: 0,
    cardBaseInCents: 10_00,
    cardTipsInCents: 2_00,
    thirdPartyBaseInCents: 0,
    thirdPartyTipsInCents: 0,
    deliveryFeesInCents: 4_00,
    otherInCents: 0,
    paymentsInCents: 0,
    paymentTransfers: [],
});

const meta = {
    title: 'Shop/ClosingSummary',
    component: SummaryStack,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        controls: { expanded: true },
    },
} satisfies Meta<typeof SummaryStack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mobile Closing Summary — Hours info icon uses `details` (BAR-42). */
export const MobileClosing: Story = {
    args: { items: sampleClosing },
    render: (args) => (
        <Stack spacing={2} alignItems="center">
            <Typography variant="subtitle2">Closing Summary</Typography>
            <SummaryStack {...args} />
            <Typography variant="caption" color="text.secondary">
                Hover the info icon on Hours / Cards / Payments for details.
            </Typography>
        </Stack>
    ),
};

export const MobileTakeHome: Story = {
    args: { items: sampleTakeHome },
    render: (args) => (
        <Stack spacing={2} alignItems="center">
            <Typography variant="subtitle2">Take Home</Typography>
            <SummaryStack {...args} />
        </Stack>
    ),
};

export const HoursUnset: Story = {
    args: { items: hoursUnsetClosing },
    parameters: { controls: { disable: true } },
};

export const DuplicateClosingPaymentWarning: Story = {
    args: { items: sampleClosing },
    parameters: { controls: { disable: true } },
    render: () => {
        const payments = [
            ...storyCashTransfers.filter((t) => t.transfer_type === 'payment'),
            duplicateClosingPayment,
        ];
        const items = buildMobileClosingItems({
            totalInCents: 100_00,
            bankInCents: 20_00,
            hours: 4,
            hoursInCents: 20_00,
            cardBaseInCents: 30_00,
            cardTipsInCents: 5_00,
            thirdPartyBaseInCents: 0,
            thirdPartyTipsInCents: 0,
            deliveryFeesInCents: 8_00,
            otherInCents: 0,
            paymentsInCents: -55_00,
            paymentTransfers: payments,
        });
        const dupCount = countClosingPayments(payments);
        return (
            <Stack spacing={2} maxWidth={400}>
                {dupCount > 1 && (
                    <Alert severity="warning">
                        {dupCount} transfers titled &quot;{CLOSING_PAYMENT_TITLE}&quot; — earliest is used when
                        closing.
                    </Alert>
                )}
                <SummaryStack items={items} />
            </Stack>
        );
    },
};
