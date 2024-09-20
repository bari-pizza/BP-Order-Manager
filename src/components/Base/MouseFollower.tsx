import { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useThrottle } from '@uidotdev/usehooks';
import { useIsMouseOffScreen } from '../../hooks/useIsMouseOffScreen';

const StyledMouseFollower = styled('div')({
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'white', // Add background for visibility
    borderRadius: '8px',
    padding: '8px',
    zIndex: 9999,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Optional styling
});

export const MouseFollower = ({
    children,
    offset = { top: 20, left: 20 },
    throttle = 30,
    buffer = 10,
}: {
    children: React.ReactNode;
    offset?: { top: number; left: number };
    throttle?: number;
    buffer?: number;
}) => {
    const [mousePosition, setMousePosition] = useState({ top: 0, left: 0 });
    const throttledPosition = useThrottle(mousePosition, throttle);
    const isMouseOffScreen = useIsMouseOffScreen();
    const followerRef = useRef<HTMLDivElement>(null);
    const [followerSize, setFollowerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            setMousePosition({ top: clientY, left: clientX });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        // Measure the size of the follower once it's rendered
        if (followerRef.current) {
            const { width, height } = followerRef.current.getBoundingClientRect();
            setFollowerSize({ width, height });
        }
    }, [children]);

    const { innerWidth, innerHeight } = window;
    const { top, left } = throttledPosition;

    let newTop = top + offset.top;
    let newLeft = left + offset.left;

    // Adjust position to stay within the screen bounds using actual size and buffer
    if (newLeft + followerSize.width + buffer > innerWidth) {
        newLeft = innerWidth - followerSize.width - buffer;
    }
    if (newTop + followerSize.height + buffer > innerHeight) {
        newTop = innerHeight - followerSize.height - buffer;
    }
    if (newLeft < buffer) {
        newLeft = buffer;
    }
    if (newTop < buffer) {
        newTop = buffer;
    }

    if (isMouseOffScreen) {
        return null;
    }

    return (
        <StyledMouseFollower ref={followerRef} style={{ top: newTop, left: newLeft }}>
            {children}
        </StyledMouseFollower>
    );
};
