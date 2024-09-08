import { Stack } from '@mui/material';
import { OrderOrigin } from '../../typesAndValidators';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { ThirdPartiesTable } from './ThirdPartiesTable';

const sortThirdParties = (a: OrderOrigin, b: OrderOrigin) => {
    return a.name.localeCompare(b.name);
};

type ThirdParty = Omit<OrderOrigin, 'is_third_party'> & {
    is_third_party: true;
};

export const ThirdPartiesTab = () => {
    const { origins } = useBariPizzaContext();
    const thirdParties = origins.filter((origin) => origin.is_third_party).sort(sortThirdParties) as ThirdParty[];
    return (
        <Stack direction="column">
            <ThirdPartiesTable thirdParties={thirdParties} />
        </Stack>
    );
};
