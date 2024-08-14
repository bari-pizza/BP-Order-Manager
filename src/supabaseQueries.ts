import { supaClient } from './supaClient';
import { Tables } from './supabase';
;
export type Profile = Tables<'profiles'>;
export type Drawer = Tables<'drawers'>;
export type DrawerType = Tables<'drawers'>['drawer_type'];
export type DriverDrawer = Drawer & {driver: Profile};

export const getAllDrawers = async () => {
    const { data, error } = await supaClient
        .from('drawers')
        .select('*')
        .neq('drawer_type', 'driver')

    if(error) {
        console.error(error);
        return [] as Drawer[];
    }

    return data as unknown as Drawer[];
} 

export const getAllDrivers = async () => {
    const { data, error } = await supaClient
        .from('drawers.drivers')
        .select('drawer:drawers(*), driver:profiles(*)')

    if(error) {
        console.error(error);
        return [] as DriverDrawer[];
    }

    return data as unknown as DriverDrawer[];
}
