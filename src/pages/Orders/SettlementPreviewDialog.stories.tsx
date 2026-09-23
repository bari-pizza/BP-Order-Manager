import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SettlementPreviewDialog, type SettlementTab } from './SettlementPreviewDialog';
import {
    buildMobileClosingItems,
    buildMobileTakeHomeItems,
    withProvisionalClosingPayment,
} from './mobileClosingSummary';

const payTheShopItems = withProvisionalClosingPayment(
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

const takeHomeItems = buildMobileTakeHomeItems({
    hours: 5,
    hoursInCents: 75_00,
    cashTipsInCents: 12_00,
    cardTipsInCents: 28_00,
    thirdPartyTipsInCents: 8_00,
    deliveryFeesInCents: 16_00,
});

const meta = {
    title: 'Shop/SettlementPreviewDialog',
    component: SettlementPreviewDialog,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
} satisfies Meta<typeof SettlementPreviewDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = () => {
    const [open, setOpen] = useState(true);
    const [tab, setTab] = useState<SettlementTab>(0);
    return (
        <SettlementPreviewDialog
            open={open}
            onClose={() => setOpen(false)}
            activeTab={tab}
            onTabChange={setTab}
            payTheShopItems={payTheShopItems}
            takeHomeItems={takeHomeItems}
        />
    );
};

export const Default: Story = {
    args: {
        open: true,
        onClose: () => undefined,
        activeTab: 0,
        onTabChange: () => undefined,
        payTheShopItems,
        takeHomeItems,
    },
    render: () => <Interactive />,
};
