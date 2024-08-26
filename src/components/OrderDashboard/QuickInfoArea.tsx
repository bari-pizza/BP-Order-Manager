import { Button, Stack, Typography } from '@mui/material';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../dataHooks/useContextData';

export const QuickInfoArea = () => {
    const { openDrawer: drawer, removeTicketsFromDrawer } = useOrderDashboardContext();

    const body = drawer && (
        <>
            <Typography sx={{ textAlign: 'center' }}>{getDrawerFullName(drawer)} info goes here!</Typography>
            <Button onClick={() => removeTicketsFromDrawer({ drawerID: drawer.drawer_id })}>
                Remove Selected Orders
            </Button>
        </>
    );
    return (
        <Stack height="150px" justifyContent="center">
            {body}
        </Stack>
    );
};
