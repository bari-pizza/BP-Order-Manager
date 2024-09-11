import { Stack } from '@mui/material';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { OriginsTable } from './ThirdPartiesTable';

export const ThirdPartiesTab = () => {
    const { origins } = useBariPizzaContext();

    return (
        <Stack direction="column">
            <OriginsTable origins={origins} />
        </Stack>
    );
};
