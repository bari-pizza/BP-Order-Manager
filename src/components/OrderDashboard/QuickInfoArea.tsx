import { Button, Stack, Typography } from '@mui/material';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';

export const QuickInfoArea = () => {
    const { drawer, ticket } = useOrderDashboardContext();

    const body = drawer.current && (
        <>
            <Typography sx={{ textAlign: 'center' }}>{getDrawerFullName(drawer.current)} info goes here!</Typography>
            <Button onClick={drawer.removeOrders}>Remove Selected Orders</Button>
        </>
    );
    return (
        <Stack height="150px" justifyContent="center">
            {body}
            <Button onClick={ticket.all.collapse}>{ticket.all.areCollapsed ? 'Expand' : 'Collapse'} All</Button>
            <Button onClick={ticket.all.select}>{ticket.all.areSelected ? 'Unselect' : 'Select'} All</Button>
        </Stack>
    );
};
