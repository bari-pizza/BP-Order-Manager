import React from 'react';
import { Stack } from '@mui/material';

interface ScrollableWindowProps {
    children: React.ReactNode;
    height?: string | number; // Allow passing custom height
    gradientHeight?: number;
}

export const ScrollableWindow = ({ children, height = '100vh', gradientHeight = 80 }: ScrollableWindowProps) => {
    return (
        <Stack
            className="scrollable-window-wrapper"
            sx={{
                position: 'relative',
                height,
                overflow: 'visible',
            }}>
            {/* Top gradient overlay */}
            <Stack
                className="gradient-overlay"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: gradientHeight,
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />

            {/* Scrollable content */}
            <Stack
                className="scrollable-window"
                sx={{
                    position: 'relative',
                    height: '100%',
                    overflowY: 'auto',
                    padding: `${gradientHeight / 2}px 0`,
                    overscrollBehaviorY: 'none',
                    // backgroundColor: '#fff',
                    // backgroundColor: 'rgb(249 127 127 / 80%)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                {children}
            </Stack>

            {/* Bottom gradient overlay */}
            <Stack
                className="gradient-overlay"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: gradientHeight,
                    background: 'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />
        </Stack>
    );
};
