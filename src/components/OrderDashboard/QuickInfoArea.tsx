import { Button, Stack } from '@mui/material';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import { UnfoldMore as UnfoldMoreIcon, UnfoldLess as UnfoldLessIcon } from '@mui/icons-material';

export const QuickInfoArea = () => {
    const { drawer, ticket } = useOrderDashboardContext();

    // TODO: maybe add drawer avatar for unassigned
    // TODO: add tooltip for drawer avatar that only shows on hover that drawer isnt open and some tickets are selected and

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
                        {ticket.all.areSelected ? 'Unselect' : 'Select'} All
                    </Button>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {ticket.some.areSelected && (
                            <Button variant="contained" onClick={drawer.removeOrders}>
                                Remove Selected Orders
                            </Button>
                        )}
                    </Stack>
                </Stack>
            )}
        </>
    );
    // TODO: make this prettier
    return (
        <Stack height="150px" direction="column" justifyContent="center" alignItems="space-evenly" spacing={1}>
            {body}
        </Stack>
    );
};
