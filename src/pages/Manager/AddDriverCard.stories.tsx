import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { reactRouterParameters } from 'storybook-addon-remix-react-router';
import { fn } from '@storybook/test';
import { AddDriverCard } from './AddDriverCard';
import { ManagerDashboardContext } from '../../context/ManagerDashboardContext';
import {
    buildManagerDashboardValue,
    STORY_BUSINESS_DATE,
} from '../../../.storybook/contextDecorators/managerDashboardDecorators';
import { bariPizzaContextDecorators } from '../../../.storybook/contextDecorators';

const onCreate = fn().mockName('cashTransfers.create');

const meta = {
    title: 'Shop/AddDriverCard',
    component: AddDriverCard,
    tags: ['autodocs'],
    decorators: [
        bariPizzaContextDecorators.default,
        (Story) => (
            <ManagerDashboardContext.Provider
                value={buildManagerDashboardValue({ onCreate: (ct) => onCreate(ct) })}>
                <Story />
            </ManagerDashboardContext.Provider>
        ),
    ],
    parameters: {
        layout: 'padded',
        reactRouter: reactRouterParameters({
            location: { searchParams: { businessDate: STORY_BUSINESS_DATE.format('YYYY-MM-DD') } },
        }),
    },
    args: {
        open: fn(),
        close: fn(),
        isOpen: true,
    },
} satisfies Meta<typeof AddDriverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Open the dialog, pick a driver + bank, submit.
 * Actions panel should show `cashTransfers.create` with `business_date: 2026-09-15`
 * (not calendar today) — BAR-39.
 */
export const DialogOpen: Story = {
    render: () => {
        const [open, setOpen] = useState(true);
        return (
            <Stack spacing={2} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                    URL businessDate={STORY_BUSINESS_DATE.format('YYYY-MM-DD')} — bank create must use this date.
                </Typography>
                <AddDriverCard open={() => setOpen(true)} close={() => setOpen(false)} isOpen={open} />
            </Stack>
        );
    },
};
