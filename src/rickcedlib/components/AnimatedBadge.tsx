import { useEffect, useState } from 'react';
import { Badge, BadgeProps } from '@mui/material';
import { useInterval } from 'usehooks-ts';

type AnimatedBadgeProps = BadgeProps & {
    badgeCount: {
        start: number | null;
        end: number;
    };
};

export const AnimatedBadge = ({ badgeCount: { start, end }, ...props }: AnimatedBadgeProps) => {
    const [currentStep, setCurrentStep] = useState(start);
    const [isPlaying, setPlaying] = useState(false);
    const [accDelay, setAccDelay] = useState(0);
    const delay = (500 + 3 * accDelay) / Math.abs(end - (start ?? end));

    useInterval(
        () => {
            if (currentStep === null || end === null) {
                setCurrentStep(end);
                setPlaying(false);
                return;
            }
            if (currentStep < end) {
                setCurrentStep((prev) => prev! + 1);
            } else if (currentStep > end) {
                setCurrentStep((prev) => prev! - 1);
            } else {
                setPlaying(false);
            }
            setAccDelay((prev) => prev + delay);
        },
        isPlaying ? delay : null,
    );

    useEffect(() => {
        if (start !== end) {
            setPlaying(true);
        }
    }, [start, end]);

    if (start === null) {
        return <Badge {...props} badgeContent={end} />;
    }

    return <Badge {...props} badgeContent={currentStep} />;
};

// USE IN FUTURE PROJECTS
