import { Player } from '@lottiefiles/react-lottie-player';
import { Stack } from '@mui/material';
import PizzaShopLottie from '../../assets/Pizza Shop.json';
import PizzaShopMobileLottie from '../../assets/Pizza Shop Mobile.json';
import { useLayoutContext } from '../../hooks/data/useContextData';

export const Home = () => {
    const { isMobile } = useLayoutContext();
    return (
        <Stack alignItems="center" justifyContent="center" direction="column" height="100vh">
            {isMobile ? (
                <Player autoplay src={PizzaShopMobileLottie} style={{ maxHeight: '100vh' }} keepLastFrame />
            ) : (
                <Player autoplay src={PizzaShopLottie} style={{ maxHeight: '100vh' }} keepLastFrame />
            )}
        </Stack>
    );
};
