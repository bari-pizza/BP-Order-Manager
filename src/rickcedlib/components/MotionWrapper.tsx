import { StackProps, Stack, GridProps, Grid } from '@mui/material';
import { MotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
    children: ReactNode;
    motionProps: MotionProps;
    stackProps?: StackProps;
    gridProps?: GridProps;
    motionKey: string;
    layoutID?: string;
}

export const MotionWrapper = ({
    motionProps,
    stackProps,
    children,
    motionKey,
    layoutID,
    gridProps,
}: MotionWrapperProps) => {
    if (gridProps) {
        return (
            <motion.div key={motionKey} {...motionProps} layoutId={layoutID}>
                <Grid {...gridProps}>{children}</Grid>
            </motion.div>
        );
    }
    return (
        <motion.div key={motionKey} {...motionProps} layoutId={layoutID}>
            <Stack {...stackProps}>{children}</Stack>
        </motion.div>
    );
};
