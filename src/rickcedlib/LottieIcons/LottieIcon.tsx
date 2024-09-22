import { useEffect, useRef } from 'react';
import { Stack } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';

// to get the lottie icon
// const lottieSrc = new URL('/User Profile Icon.json', import.meta.url).href;

type LottieIconProps = {
    lottieSrc: string;
    height?: string;
    width?: string;
    loop?: boolean;
    autoPlay?: boolean;
};

export const LottieIcon = ({
    lottieSrc,
    height = '35px',
    width = '35px',
    loop = true,
    autoPlay = false,
}: LottieIconProps) => {
    const playerRef = useRef<Player | null>(null); // Ref to access Player methods
    const containerRef = useRef<HTMLDivElement | null>(null); // Ref to access DOM methods

    useEffect(() => {
        const hoverAncestor = containerRef.current?.closest('.lottie-icon-container'); // Detect the closest ancestor with the hover class
        if (!hoverAncestor) return;

        const handleHover = () => {
            if (playerRef.current) {
                playerRef.current.stop(); // Stop any previous animation
                playerRef.current.play(); // Play the animation when the ancestor is hovered
            }
        };

        const handleLeave = () => {
            if (playerRef.current) {
                // small delay before stopping
                setTimeout(() => {
                    playerRef.current?.stop();
                }, 150);
                // playerRef.current.stop(); // Stop the animation
            }
        };

        hoverAncestor.addEventListener('mouseenter', handleHover);
        hoverAncestor.addEventListener('mouseleave', handleLeave);

        return () => {
            hoverAncestor.removeEventListener('mouseenter', handleHover);
            hoverAncestor.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            if (autoPlay) {
                playerRef.current.play(); // Play animation if autoPlay is true
            } else {
                setTimeout(() => {
                    playerRef.current?.stop(); // Stop animation if autoPlay is false
                }, 150);
            }
        }
    }, [autoPlay]);

    return (
        <Stack
            direction="row"
            alignItems="baseline"
            height={height}
            width={width}
            justifyContent="center"
            ref={containerRef}>
            <Player
                ref={playerRef}
                src={lottieSrc}
                loop={loop}
                autoplay={autoPlay}
                style={{ minHeight: height, minWidth: width }}
            />
        </Stack>
    );
};
