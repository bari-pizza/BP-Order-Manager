import { Skeleton, Stack } from '@mui/material';

export const MyAccountSkeleton = () => {
    return (
        <Stack direction="column" sx={{ height: '100%' }} mt={2}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
        </Stack>
    );
};
