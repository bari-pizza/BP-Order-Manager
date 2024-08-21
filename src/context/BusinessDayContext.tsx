import { createContext } from 'react';
import type { Drawer, DriverDrawer } from '../supabaseQueries';

interface BusinessDayContextProps {
    drawers: Drawer[];
    drivers: DriverDrawer[];
}

export const BusinessDayContext = createContext<BusinessDayContextProps>({
    drawers: [],
    drivers: [],
});
