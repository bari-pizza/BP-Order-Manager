import { Player } from '@lottiefiles/react-lottie-player';
import { Stack } from '@mui/material';
import PizzaShopLottie from '../../assets/Pizza Shop.json';
import PizzaShopMobileLottie from '../../assets/Pizza Shop Mobile.json';
import { useLayoutContext } from '../../hooks/data/useContextData';

export const Home = () => {
    const { isMobile } = useLayoutContext();
    // Mobile Lottie is 1550×4025 (very tall). Cap both axes so it can't force horizontal scroll on phones.
    const playerStyle = {
        width: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        height: 'auto',
    } as const;

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="column"
            height="100%"
            minHeight="100vh"
            width="100%"
            overflow="hidden">
            {isMobile ? (
                <Player autoplay src={PizzaShopMobileLottie} style={playerStyle} keepLastFrame />
            ) : (
                <Player autoplay src={PizzaShopLottie} style={playerStyle} keepLastFrame />
            )}
        </Stack>
    );
};
