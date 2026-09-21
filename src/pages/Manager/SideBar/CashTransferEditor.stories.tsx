import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { reactRouterParameters } from 'storybook-addon-remix-react-router';
import { fn } from '@storybook/test';
import { CashTransferEditor } from './CashTransferEditor';
import {
    managerDashboardDecorators,
    storyCashTransfers,
} from '../../../../.storybook/contextDecorators/managerDashboardDecorators';
import { dummyDrawers } from '../../../dummyData';
import { CLOSING_PAYMENT_TITLE } from '../../../constants/cashTransfers';

const driver = dummyDrawers.drivers[0];
const register = dummyDrawers.drawers[0];
const bank = storyCashTransfers.find((t) => t.transfer_type === 'bank')!;
const closing = storyCashTransfers.find((t) => t.title === CLOSING_PAYMENT_TITLE)!;
const other = storyCashTransfers.find((t) => t.transfer_type === 'other')!;

const meta = {
    title: 'Shop/CashTransferEditor',
    component: CashTransferEditor,
    tags: ['autodocs'],
    decorators: [managerDashboardDecorators.default],
    parameters: {
        layout: 'padded',
        controls: { expanded: true },
        reactRouter: reactRouterParameters({
            location: { searchParams: { businessDate: '2026-09-15' } },
        }),
    },
    args: {
        drawerID: driver.drawer_id,
        isEditing: false,
        setIsEditing: fn(),
        forNewCashTransfer: true as const,
        canCreateBankTransfer: true,
    },
} satisfies Meta<typeof CashTransferEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const EditableRow = ({
    cashTransfer,
    transferType,
}: {
    cashTransfer: (typeof storyCashTransfers)[0];
    transferType: 'bank' | 'payment' | 'other';
}) => {
    const [editing, setEditing] = useState(false);
    return (
        <CashTransferEditor
            cashTransfer={cashTransfer}
            drawerID={driver.drawer_id}
            transferType={transferType}
            isEditing={editing}
            setIsEditing={setEditing}
        />
    );
};

/** Collapsed rows — click Edit to open the dense editor. */
export const ListRows: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <Stack spacing={1} minWidth={360}>
            <Typography variant="caption" color="text.secondary">
                Business date in URL: 2026-09-15 (same as Add Driver bank stamp).
            </Typography>
            <EditableRow cashTransfer={bank} transferType="bank" />
            <EditableRow cashTransfer={closing} transferType="payment" />
            <EditableRow cashTransfer={other} transferType="other" />
        </Stack>
    ),
};

/** Close-drawer Closing Payment seed (locked title). */
export const ClosingPaymentNew: Story = {
    parameters: { controls: { disable: true } },
    render: () => {
        const [editing, setEditing] = useState(true);
        return (
            <CashTransferEditor
                forNewCashTransfer
                isEditing={editing}
                setIsEditing={setEditing}
                drawerID={driver.drawer_id}
                transferType="payment"
                definedValues={{
                    cashTransfer: {
                        amount_in_cents: 4500,
                        source: driver.drawer_id,
                        destination: register.drawer_id,
                        title: CLOSING_PAYMENT_TITLE,
                    },
                    completedFirstStep: true,
                    toFromSpentReceived: 'to',
                    validDrawerFilter: (d) => d.drawer_type === 'register',
                }}
            />
        );
    },
};

/** Type picker first step (bank hidden when canCreateBankTransfer=false). */
export const NewTransferTypePicker: Story = {
    parameters: { controls: { disable: true } },
    render: () => {
        const [editing, setEditing] = useState(true);
        return (
            <CashTransferEditor
                forNewCashTransfer
                isEditing={editing}
                setIsEditing={setEditing}
                drawerID={driver.drawer_id}
                canCreateBankTransfer
            />
        );
    },
};
