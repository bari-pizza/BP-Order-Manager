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
            <Grid container spacing={1} alignItems="stretch">
                {displayResources.map((resource) => {
                    const meta = REQUIRED_RESOURCES.find((item) => item.title === resource.title);
                    return (
                        <Grid item key={resource.title}>
                            <Card
                                className="lottie-icon-container"
                                sx={{
                                    width: 200,
                                    height: 260,
                                    border: '2px solid',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                <CardContent sx={{ flex: 1, display: 'flex', p: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack
                                        spacing={1.5}
                                        alignItems="center"
                                        justifyContent="flex-start"
                                        width="100%"
                                        height="100%">
                                        <ResourceUploader resource={resource} isAnimated />
                                        <Typography variant="body1" component="div" textAlign="center" minHeight={48}>
                                            {resource.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            textAlign="center"
                                            sx={{
                                                minHeight: 60,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                            {meta?.description}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Stack>
    );
};
