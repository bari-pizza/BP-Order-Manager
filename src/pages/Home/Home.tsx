import { Player } from '@lottiefiles/react-lottie-player';
import { Stack } from '@mui/material';
import PizzaShopLottie from '../../assets/Pizza Shop.json';

export const Home = () => {
    return (
        <Stack alignItems="center" justifyContent="center" direction="column" height="100vh">
            <Player autoplay src={PizzaShopLottie} style={{ maxHeight: '100vh' }} keepLastFrame />
        </Stack>
    );
};
