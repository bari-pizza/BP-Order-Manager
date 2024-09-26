import { useEffect, useRef } from 'react';
import { Stack } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';

type LottieIconProps = {
    lottieSrc: string | object;
    height?: string;
    width?: string;
    autoPlay?: boolean;
};

export const LottieIcon = ({ lottieSrc, height = '35px', width = '35px', autoPlay = false }: LottieIconProps) => {
    const playerRef = useRef<Player | null>(null); // Ref to access Player methods
    const containerRef = useRef<HTMLDivElement | null>(null); // Ref to access DOM methods

    useEffect(() => {
        const hoverAncestor = containerRef.current?.closest('.lottie-icon-container'); // Detect the closest ancestor with the hover class
        if (!hoverAncestor) return;

        const handleHover = () => {
            if (playerRef.current) {
                playerRef.current.play();
                playerRef.current.setLoop(true);
            }
        };

        const handleLeave = () => {
            if (playerRef.current) {
                playerRef.current.setLoop(false);
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
                playerRef.current.play();
                playerRef.current.setLoop(true);
            } else {
                setTimeout(() => {
                    playerRef.current?.setLoop(false);
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
                loop
                autoplay={autoPlay}
                style={{ minHeight: height, minWidth: width }}
            />
        </Stack>
    );
};
