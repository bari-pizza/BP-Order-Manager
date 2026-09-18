import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography } from '@mui/material';
import { RoundImage } from './RoundImage';
import { resourceSrc, roundImageSrcOptions } from '../../../.storybook/fixtures/resources';

const meta = {
    title: 'Foundation/RoundImage',
    component: RoundImage,
    tags: ['autodocs'],
    args: {
        src: resourceSrc.bariPizza,
        alt: 'Bari Pizza',
        size: 'large',
        variant: 'border',
        bump: true,
    },
    argTypes: {
        src: {
            control: 'select',
            options: Object.keys(roundImageSrcOptions),
            mapping: roundImageSrcOptions,
            description: 'Pick a real Resource image (or empty for the person fallback).',
        },
        alt: { control: 'text' },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large', 'xlarge'],
        },
        variant: {
            control: 'radio',
            options: ['border', 'standard'],
        },
        bump: {
            control: 'boolean',
            description: 'Lift on hover (on for avatars / cards; off in tables).',
        },
        style: { control: false },
        className: { control: false },
    },
    parameters: {
        // Keep the Controls panel active for this component — interview demo.
        controls: { expanded: true },
    },
} satisfies Meta<typeof RoundImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story. Bottom panel → **Controls** (should open automatically).
 * Change size / bump / image — the avatar updates live.
 */
export const Playground: Story = {};

/** One glance at sizes + empty-src fallback (no separate stories for each case). */
export const SizesAndFallback: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <Stack spacing={3} alignItems="flex-start">
            <Stack direction="row" spacing={3} alignItems="flex-end">
                {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
                    <Stack key={size} spacing={1} alignItems="center">
                        <RoundImage src={resourceSrc.bariPizza} alt="Bari Pizza" size={size} variant="border" bump />
                        <Typography variant="caption">{size}</Typography>
                    </Stack>
                ))}
            </Stack>
            <Stack direction="row" spacing={3} alignItems="flex-end">
                <Stack spacing={1} alignItems="center">
                    <RoundImage src="" alt="Unassigned" size="large" variant="border" />
                    <Typography variant="caption">empty src</Typography>
                </Stack>
                <Stack spacing={1} alignItems="center">
                    <RoundImage src={resourceSrc.missingAvatar} alt="Missing" size="large" variant="border" />
                    <Typography variant="caption">Missing Avatar resource</Typography>
                </Stack>
                <Stack spacing={1} alignItems="center">
                    <RoundImage src={resourceSrc.register} alt="Register" size="large" variant="border" bump />
                    <Typography variant="caption">Register</Typography>
                </Stack>
            </Stack>
        </Stack>
    ),
};
