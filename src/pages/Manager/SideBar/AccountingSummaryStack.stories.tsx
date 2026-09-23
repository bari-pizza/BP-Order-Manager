import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography } from '@mui/material';
import { AccountingSummaryStack } from './AccountingSummaryStack';
import {
    buildMobileClosingItems,
    buildMobileTakeHomeItems,
    withProvisionalClosingPayment,
} from '../../Orders/mobileClosingSummary';
import { storyCashTransfers } from '../../../../.storybook/contextDecorators/managerDashboardDecorators';

const sampleClosing = withProvisionalClosingPayment(
    buildMobileClosingItems({
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
        paymentTransfers: [],
    }),
    [],
);

const sampleClosingWithPayment = buildMobileClosingItems({
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
    drawerID: storyCashTransfers.find((t) => t.transfer_type === 'payment')!.source!,
    drawerName: 'Alex Demo',
});

const sampleTakeHome = buildMobileTakeHomeItems({
    hours: 5,
    hoursInCents: 75_00,
    cashTipsInCents: 12_00,
    cardTipsInCents: 28_00,
    thirdPartyTipsInCents: 8_00,
    deliveryFeesInCents: 16_00,
});

const meta = {
    title: 'Shop/AccountingSummaryStack',
    component: AccountingSummaryStack,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        controls: { expanded: true },
    },
} satisfies Meta<typeof AccountingSummaryStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PayTheShopProvisional: Story = {
    args: { items: sampleClosing },
    render: (args) => (
        <Stack spacing={2} maxWidth={420}>
            <Typography variant="subtitle2">Pay the shop (provisional Closing Payment)</Typography>
            <AccountingSummaryStack {...args} />
        </Stack>
    ),
};

export const PayTheShopSavedPayment: Story = {
    args: { items: sampleClosingWithPayment },
    render: (args) => (
        <Stack spacing={2} maxWidth={420}>
            <Typography variant="subtitle2">Pay the shop (saved Closing Payment)</Typography>
            <AccountingSummaryStack {...args} />
        </Stack>
    ),
};

export const TakeHome: Story = {
    args: { items: sampleTakeHome },
    render: (args) => (
        <Stack spacing={2} maxWidth={420}>
            <Typography variant="subtitle2">Take home</Typography>
            <AccountingSummaryStack {...args} />
        </Stack>
    ),
};
