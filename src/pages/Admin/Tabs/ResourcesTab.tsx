import { Box, Stack, Typography, Tooltip } from '@mui/material';
import { AnimatePresence, MotionProps } from 'framer-motion';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { ResourceUploader } from '../ResourceUploader';
import { REQUIRED_RESOURCES, mergeResourcesWithDefaults } from '../../../constants/resources';
import { MotionWrapper } from '../../../rickcedlib/components/MotionWrapper';
import { hoverBumpSx } from '../../../components/Base/hoverBump';

const tileSx = {
    height: '16em',
    width: '12em',
    border: '1px solid',
    borderColor: 'primary.main',
    borderRadius: 1,
    bgcolor: 'background.paper',
    color: 'primary.main',
    cursor: 'default',
    transition: 'background-color 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    '&:hover': {
        bgcolor: 'primary.light',
    },
} as const;

const motionProps: MotionProps = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
};

export const ResourcesTab = () => {
    const { resources } = useBariPizzaContext();
    const displayResources = mergeResourcesWithDefaults(resources);

    return (
        <Stack spacing={2} width="100%">
            <Typography variant="body2" color="text.secondary">
                These are UI icons the app looks up by name (register drawers, missing avatars, add-driver, etc.). Click
                an icon to upload a new image. Hover for what each one is used for.
            </Typography>
            <Stack
                direction="row"
                flexWrap="wrap"
                gap={2}
                p={1}
                width="100%"
                alignItems="flex-start"
                justifyContent="flex-start">
                <AnimatePresence>
                    {displayResources.map((resource) => {
                        const meta = REQUIRED_RESOURCES.find((item) => item.title === resource.title);
                        return (
                            <MotionWrapper
                                motionProps={motionProps}
                                motionKey={resource.title}
                                key={resource.title}>
                                <Tooltip title={meta?.description ?? ''} arrow placement="top">
                                    <Box className="lottie-icon-container resource-card" sx={tileSx}>
                                        <Box sx={hoverBumpSx}>
                                            <ResourceUploader
                                                resource={resource}
                                                size="xlarge"
                                                style={{ height: '6em', width: '6em' }}
                                            />
                                        </Box>
                                        <Stack justifyContent="center" alignItems="center" height="50px">
                                            <Typography variant="body2" textAlign="center" px={1}>
                                                {resource.title}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Tooltip>
                            </MotionWrapper>
                        );
                    })}
                </AnimatePresence>
            </Stack>
        </Stack>
    );
};
