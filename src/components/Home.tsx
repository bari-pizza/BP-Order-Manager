import { Player } from '@lottiefiles/react-lottie-player';
import { Stack } from '@mui/material';
import lottieSrc from '../../public/Pizza Shop.json';

export const Home = () => {
    return (
        <Stack alignItems="center" justifyContent="center" direction="column" height="100vh">
            <Player autoplay src={lottieSrc} style={{ maxHeight: '100vh' }} keepLastFrame />
        </Stack>
    );
};
