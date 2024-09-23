import { Player } from '@lottiefiles/react-lottie-player';
import { Stack, Typography } from '@mui/material';
import ConstructionLottie from './assets/Under Construction.json';

export const UnderConstruction = () => {
    return (
        <Stack alignItems="center" justifyContent="center" direction="column" height="100vh">
            <Typography variant="h1">Under Construction</Typography>
            <Player autoplay loop src={ConstructionLottie} style={{ maxHeight: '100vh' }} />
        </Stack>
    );
};
