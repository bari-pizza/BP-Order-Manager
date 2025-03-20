import { Stack } from '@mui/material';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';

import { Resource } from '../../../typesAndValidators';
import { ResourcesTable } from '../Tables/ResourcesTable';

const sortResources = (a: Resource, b: Resource) => {
    const aName = a.title.toLowerCase();
    const bName = b.title.toLowerCase();

    if (aName < bName) {
        return -1;
    }

    if (aName > bName) {
        return 1;
    }

    return 0;
};

export const ResourcesTab = () => {
    const { resources } = useBariPizzaContext();

    const sortedResources = [...resources].sort(sortResources);

    return (
        <Stack direction="column" alignItems={'center'} gap={2} height={'100%'}>
            <ResourcesTable resources={sortedResources} />
        </Stack>
    );
};
