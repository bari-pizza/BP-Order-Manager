import { Player } from '@lottiefiles/react-lottie-player';
import { Stack } from '@mui/material';
const lottieSrc = new URL('./Pizza Shop.json', import.meta.url).href;

export const Home = () => {
    return (
        <Stack alignItems="center" justifyContent="center" direction="column" height="100vh">
            <Player autoplay src={lottieSrc} style={{ maxHeight: '100vh' }} keepLastFrame />
        </Stack>
    );
};
