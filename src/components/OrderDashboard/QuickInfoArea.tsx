import { Stack, Typography } from '@mui/material';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../dataHooks/useContextData';

export const QuickInfoArea = () => {
    const { openDrawer: drawer } = useOrderDashboardContext();

    const body = drawer && <Typography>{getDrawerFullName(drawer)} info goes here!</Typography>;
    return (
        <Stack height="150px" flex="none">
            {body}
        </Stack>
    );
};
