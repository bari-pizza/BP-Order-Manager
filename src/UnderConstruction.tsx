import { Player } from '@lottiefiles/react-lottie-player';
import { Stack, Typography } from '@mui/material';
const lottieSrc = new URL('/Under Construction.json', import.meta.url).href;

export const UnderConstruction = () => {
    return (
        <Stack alignItems="center" justifyContent="center" direction="column" height="100vh">
            <Typography variant="h1">Under Construction</Typography>
            <Player autoplay loop src={lottieSrc} style={{ maxHeight: '100vh' }} />
        </Stack>
    );
};
