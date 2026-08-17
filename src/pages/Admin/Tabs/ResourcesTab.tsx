import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { ResourceUploader } from '../ResourceUploader';
import { REQUIRED_RESOURCES, mergeResourcesWithDefaults } from '../../../constants/resources';

export const ResourcesTab = () => {
    const { resources } = useBariPizzaContext();
    const displayResources = mergeResourcesWithDefaults(resources);

    return (
        <Stack spacing={2} width="100%">
            <Typography variant="body2" color="text.secondary">
                These are UI icons the app looks up by name (register drawers, missing avatars, add-driver, etc.). Upload
                an image for each card. They are not a general file library.
            </Typography>
            <Grid container direction="row" alignItems={'center'} gap={1}>
                {displayResources.map((resource) => {
                    const meta = REQUIRED_RESOURCES.find((item) => item.title === resource.title);
                    return (
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
                                    {meta && (
                                        <Typography variant="caption" color="text.secondary" textAlign="center">
                                            {meta.description}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
            </Grid>
        </Stack>
    );
};
