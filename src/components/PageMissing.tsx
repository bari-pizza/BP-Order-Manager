import { Player } from '@lottiefiles/react-lottie-player';
import { Stack, Typography } from '@mui/material';

export const PageMissing = () => {
    return (
        <Stack alignItems="center" justifyContent="center" direction="column" height={'100%'} width={'100%'}>
            <Typography variant="h4">Sorry this page does not exist</Typography>
            <Player
                style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: 'calc(100vh - 58px)',
                }}
                autoplay
                loop
                src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json"
            />
        </Stack>
    );
};
