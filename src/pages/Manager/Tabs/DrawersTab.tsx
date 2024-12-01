import { Stack, StackOwnProps } from '@mui/material';
import { DrawerCard } from '../DrawerCard';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { AddDriverCard } from '../AddDriverCard';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { DrawerSideBar, DrawerSideBarSkeleton } from '../SideBar/DrawerSideBar';
import { ContextMenu } from '../../../components/Base/ContextMenu';
import { MotionProps } from 'framer-motion';
import { MotionWrapper } from '../../../rickcedlib/components/MotionWrapper';
import { Suspense, useRef } from 'react';
import { CloseBusinessDayCard } from '../CloseBusinessDayCard';
import { useResizeObserver } from 'usehooks-ts';
import { nonZeroModulo } from '../../../utils';

const stackProps: Partial<StackOwnProps> = {
    direction: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '300px',
    height: '300px',
    // overflow: 'hidden',
    pb: 1,
};

export const DrawersTab = () => {
    const addDriverCardDialogProps = useDialogProps();
    const { combinedDrawersAndDrivers, businessDay } = useManagerDashboardContext();
    const ref = useRef<HTMLDivElement>(null);
    const { width = 0 } = useResizeObserver({ ref, box: 'border-box' });

    const cardWidth = 168;
    const columnGap = 16;
    const columnCount = Math.floor((width + columnGap) / (cardWidth + columnGap));
    const childrenCount = combinedDrawersAndDrivers.length + (businessDay.isLocked ? 1 : 2);
    const extraCards = nonZeroModulo(childrenCount, columnCount);
    const columnSpan = columnCount - extraCards + 1;
    const lastCardWidth = columnSpan * cardWidth + Math.max(0, columnSpan - 1) * columnGap + 'px';

    // TODO: probably fix ContextMenu for Drawer

    const motionProps: MotionProps = {
        whileTap: { scale: 0.95 },
        whileHover: { scale: 1.05 },
    };

    const closeDayMotionProps: MotionProps = {
        initial: { scale: 1 },
        whileTap: { scale: 0.98 },
        whileHover: { scale: 1.02 },
    };

    return (
        <Stack
            {...stackProps}
            ref={ref}
            justifyContent={'start'}
            gap={2}
            direction="row"
            width="100%"
            height="100%"
            flexWrap={'wrap'}>
            {combinedDrawersAndDrivers.map((drawer) => {
                return (
                    <ContextMenu openOnType="right-click" key={drawer.drawer_id}>
                        <ContextMenu.Base>
                            <MotionWrapper motionProps={motionProps} motionKey={drawer.drawer_id}>
                                <DrawerCard drawer={drawer} />
                            </MotionWrapper>
                        </ContextMenu.Base>
                        <DrawerCard.contextMenu drawer={drawer} />
                    </ContextMenu>
                );
            })}
            {!businessDay.isLocked && (
                <MotionWrapper motionProps={motionProps} motionKey="add-driver-card">
                    <AddDriverCard {...addDriverCardDialogProps} />
                </MotionWrapper>
            )}
            <MotionWrapper
                motionProps={closeDayMotionProps}
                motionKey="close-business-day"
                stackProps={{ width: lastCardWidth }}>
                <CloseBusinessDayCard />
            </MotionWrapper>

            <Suspense fallback={<DrawerSideBarSkeleton />}>
                <DrawerSideBar />
            </Suspense>
        </Stack>
    );
};
