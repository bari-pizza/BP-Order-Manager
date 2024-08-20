import { Stack, Typography } from '@mui/material';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../dataHooks/useContextData';

export const QuickInfoArea = () => {
    const { openDrawer: drawer } = useOrderDashboardContext();
    if (!drawer) {
        return <Stack sx={{ height: 150 }}></Stack>;
    }
    const fullName = getDrawerFullName(drawer);
    return (
        <Stack sx={{ height: 150 }}>
            <Typography>{fullName} info goes here!</Typography>
        </Stack>
    );
};

// export const QuickInfoAreaSkeleton = () => {
//     return <Stack sx={{ height: 150 }}></Stack>;
// };
