import { StackProps, Stack } from '@mui/material';
import { MotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
    children: ReactNode;
    motionProps: MotionProps;
    stackProps?: StackProps;
    motionKey: string;
    layoutID?: string;
}

export const MotionWrapper = ({ motionProps, stackProps, children, motionKey, layoutID }: MotionWrapperProps) => {
    return (
        <motion.div key={motionKey} {...motionProps} layoutId={layoutID}>
            <Stack {...stackProps}>{children}</Stack>
        </motion.div>
    );
};
