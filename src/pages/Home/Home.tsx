import { Player } from '@lottiefiles/react-lottie-player';
import { Box, Stack } from '@mui/material';
import PizzaShopLottie from '../../assets/Pizza Shop.json';
import PizzaShopMobileLottie from '../../assets/Pizza Shop Mobile.json';
import { useLayoutContext } from '../../hooks/data/useContextData';

/**
 * Mobile Lottie is 1550×4025 — taller than most phones when fit-to-width.
 * Fit the whole composition inside the visible area (meet) and anchor to the
 * bottom so the pizza shop stays on-screen instead of getting clipped.
 */
export const Home = () => {
    const { isMobile } = useLayoutContext();

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="column"
            width="100%"
            // dvh tracks the visible viewport on mobile browsers (100vh often
            // includes the area under the URL bar and clips the bottom).
            height="100dvh"
            maxHeight="100dvh"
            overflow="hidden"
            sx={{ minHeight: '-webkit-fill-available' }}>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    // Lottie injects an svg; force it to respect the box.
                    '& svg': {
                        width: '100% !important',
                        height: '100% !important',
                    },
                }}>
                <Player
                    autoplay
                    keepLastFrame
                    src={isMobile ? PizzaShopMobileLottie : PizzaShopLottie}
                    style={{ width: '100%', height: '100%' }}
                    rendererSettings={{
                        // xMidYMax = horizontally centered, vertically bottom-aligned.
                        preserveAspectRatio: isMobile ? 'xMidYMax meet' : 'xMidYMid meet',
                    }}
                />
            </Box>
        </Stack>
    );
};
