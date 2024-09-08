import { StackProps, Stack } from '@mui/material';
import { MotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
    children: ReactNode;
    motionProps?: MotionProps;
    stackProps?: StackProps;
    key?: string;
}

export const MotionWrapper = ({ motionProps, stackProps, children, key }: MotionWrapperProps) => {
    return (
        <motion.div key={key} {...motionProps}>
            <Stack {...stackProps}>{children}</Stack>
        </motion.div>
    );
};
