import { StackProps, Stack } from '@mui/material';
import { MotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
    children: ReactNode;
    motionProps?: MotionProps;
    stackProps?: StackProps;
    motionKey?: string;
}

export const MotionWrapper = ({ motionProps, stackProps, children, motionKey }: MotionWrapperProps) => {
    return (
        <motion.div key={motionKey} {...motionProps}>
            <Stack {...stackProps}>{children}</Stack>
        </motion.div>
    );
};
