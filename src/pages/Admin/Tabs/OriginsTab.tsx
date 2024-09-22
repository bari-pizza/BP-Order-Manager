import { Stack } from '@mui/material';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { OriginsTable } from '../Tables/OriginsTable';

export const OriginsTab = () => {
    const { origins } = useBariPizzaContext();

    return (
        <Stack direction="column">
            <OriginsTable origins={origins} />
        </Stack>
    );
};
