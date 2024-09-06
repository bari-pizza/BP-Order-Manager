import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

interface UseAnimationProps {
    duration: number;
    start: number;
    end: number;
    stepSize: number;
}

export const useAnimation = ({ duration, start, end, stepSize }: UseAnimationProps) => {
    const [count, setCount] = useState<number>(start);
    const [isPlaying, setPlaying] = useState<boolean>(true);

    useInterval(
        () => {
            // Your custom logic here
            if (count < end) {
                setCount(count + stepSize);
            } else if (count > end) {
                setCount(count - stepSize);
            } else {
                setPlaying(false);
            }
        },
        isPlaying ? duration : null,
    );

    return count;
};
