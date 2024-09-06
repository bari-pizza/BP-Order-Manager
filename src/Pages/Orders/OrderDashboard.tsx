import { Suspense } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { QuickInfoArea } from './QuickInfoArea';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { SideBar, SideBarSkeleton } from '../../components/SideBar';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { OrderTicketArea, OrderTicketAreaSkeleton } from './OrderTicketArea';
import { useDrivers } from '../../hooks/data/useDrivers';
import { useDialogProps } from '../../hooks/ui/useDialogProps';

export const OrderDashboard = () => {
    const { drivers } = useDrivers();
    const { open, close, isOpen } = useDialogProps();
    const { ticket, drawer, orders } = useOrdersDrawersTickets();

    // TODO: would be cool to have the number of selectedTickets follow the mouse while moving on the page
    /*
    import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const MouseFollower = styled('div')({
  position: 'absolute',
  pointerEvents: 'none',
  fontSize: 24,
  fontWeight: 'bold',
});

const MouseFollowerComponent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <MouseFollower style={{ top: mousePosition.y, left: mousePosition.x }}>
      123
    </MouseFollower>
  );
};

export default MouseFollowerComponent;
    */

    return (
        <OrderDashboardContext.Provider value={{ ticket, drawer, orders, drivers }}>
            <Stack direction="column" sx={{ height: '100vh', overflowY: 'hidden' }} mt={2}>
                <Suspense fallback={<DrawerHeaderSkeleton />}>
                    <DrawerHeader />
                </Suspense>
                <Divider />
                <QuickInfoArea />
                <Divider />
                <Suspense fallback={<OrderTicketAreaSkeleton />}>
                    <OrderTicketArea />
                </Suspense>
            </Stack>
            <SideBar width="300px">
                <Stack alignContent="center" justifyContent="space-between" direction="column" height="100%">
                    {/* <Stack>{orderEditor}</Stack> */}
                    <Stack>
                        <OrderEditor close={close} isOpen={isOpen} forNewOrder />
                    </Stack>
                    <Stack direction="column" m={2} gap={2}>
                        {/* {addOrderButton} */}
                        {!isOpen && (
                            <Button variant="contained" onClick={open}>
                                Add Order
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </SideBar>
        </OrderDashboardContext.Provider>
    );
};

export const OrderDashboardSkeleton = () => {
    return (
        <Stack direction="column" sx={{ height: '100%' }} mt={2}>
            <DrawerHeaderSkeleton />
            <Divider />
            <QuickInfoArea />
            <Divider />
            <OrderTicketAreaSkeleton />
            <SideBarSkeleton width="300px">
                <Button disabled>Add Order</Button>
                <Button disabled>Toggle Tickets</Button>
            </SideBarSkeleton>
        </Stack>
    );
};
