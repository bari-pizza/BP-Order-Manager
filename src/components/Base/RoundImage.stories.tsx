import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography, Paper } from '@mui/material';
import { RoundImage } from './RoundImage';
import avatarImage from '../../assets/add-user.png';

const meta = {
    title: 'Base/RoundImage',
    component: RoundImage,
} satisfies Meta<typeof RoundImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover to compare the bump against a static avatar, at each size the app uses. */
export const Bump: Story = {
    args: { src: avatarImage, alt: 'sample avatar' },
    render: () => (
        <Stack spacing={4} padding={3}>
            <Typography variant="h6">Hover each avatar</Typography>
            <Stack direction="row" spacing={8} alignItems="center">
                <Stack spacing={1} alignItems="center">
                    <RoundImage src={avatarImage} alt="static" size="xlarge" variant="border" />
                    <Typography variant="subtitle2">static</Typography>
                </Stack>
                <Stack spacing={1} alignItems="center">
                    <RoundImage src={avatarImage} alt="bump" size="xlarge" variant="border" bump />
                    <Typography variant="subtitle2">bump</Typography>
                </Stack>
            </Stack>

            <Typography variant="h6">At the sizes actually used</Typography>
            {(['small', 'medium', 'large'] as const).map((size) => (
                <Stack key={size} direction="row" spacing={8} alignItems="center">
                    <Typography variant="body2" width={60}>
                        {size}
                    </Typography>
                    <RoundImage src={avatarImage} alt={`${size} static`} size={size} variant="border" />
                    <RoundImage src={avatarImage} alt={`${size} bump`} size={size} variant="border" bump />
                </Stack>
            ))}
        </Stack>
    ),
};

/**
 * Real-world trigger: hovering anywhere on the card plays the bump, because the card carries
 * the .lottie-icon-container class. This is how drawer cards and nav items behave.
 */
export const HoverFromParentCard: Story = {
    args: { src: avatarImage, alt: 'sample avatar' },
    render: () => (
        <Stack spacing={3} padding={3}>
            <Typography variant="h6">Hover anywhere on the card</Typography>
            <Stack direction="row" spacing={3}>
                <Paper
                    className="lottie-icon-container"
                    elevation={3}
                    sx={{ padding: 3, width: 160, textAlign: 'center', cursor: 'pointer' }}>
                    <Stack spacing={1} alignItems="center">
                        <RoundImage src={avatarImage} alt="bump" size="large" variant="border" bump />
                        <Typography variant="subtitle2">bump</Typography>
                    </Stack>
                </Paper>
                <Paper
                    className="lottie-icon-container"
                    elevation={3}
                    sx={{ padding: 3, width: 160, textAlign: 'center', cursor: 'pointer' }}>
                    <Stack spacing={1} alignItems="center">
                        <RoundImage src={avatarImage} alt="static" size="large" variant="border" />
                        <Typography variant="subtitle2">static, as in tables</Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    ),
};
