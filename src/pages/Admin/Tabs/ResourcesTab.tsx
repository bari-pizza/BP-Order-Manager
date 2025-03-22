import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';

import { Resource } from '../../../typesAndValidators';
import { ResourceUploader } from '../ResourceUploader';

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
        <Grid container direction="row" alignItems={'center'} gap={1}>
            {sortedResources.map((resource) => (
                <Card
                    className="lottie-icon-container"
                    key={resource.title}
                    sx={{
                        width: '100%',
                        maxWidth: 200,
                        border: '2px solid',
                    }}>
                    <CardContent>
                        <Stack
                            sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                            spacing={2}>
                            <ResourceUploader resource={resource} isAnimated />
                            <Typography variant="body1" component="div">
                                {resource.title}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Grid>
    );
};
