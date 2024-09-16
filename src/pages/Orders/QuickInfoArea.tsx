import { Button, Stack } from '@mui/material';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import { UnfoldMore as UnfoldMoreIcon, UnfoldLess as UnfoldLessIcon } from '@mui/icons-material';

export const QuickInfoArea = () => {
    const {
        // drawer,
        ticket,
    } = useOrderDashboardContext();

    const body = (
        <>
            {ticket.all.count > 0 && (
                <Stack direction="row" spacing={1} justifyContent="space-evenly">
                    <Button
                        variant="contained"
                        onClick={ticket.all.collapse}
                        startIcon={ticket.all.areCollapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}>
                        {ticket.all.areCollapsed ? 'Expand' : 'Collapse'} All
                    </Button>
                    <Button variant="contained" onClick={ticket.all.select}>
                        {ticket.none.areSelected ? 'Select' : 'Unselect'} All
                    </Button>
                </Stack>
            )}
        </>
    );
    // TODO: make this prettier
    return (
        <Stack
            height="150px"
            minHeight="150px"
            direction="column"
            justifyContent="center"
            alignItems="space-evenly"
            spacing={1}>
            {body}
        </Stack>
    );
};
