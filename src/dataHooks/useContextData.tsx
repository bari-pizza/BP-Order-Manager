import { useContext } from 'react';
// CONTEXTS
import { LayoutContext } from '../context/LayoutContext';
import { OrderDashboardContext } from '../context/OrderDashboardContext';
import { UserContext } from '../context/UserContext';

export const useUserContext = () => {
    return useContext(UserContext);
};

export const useLayoutContext = () => {
    return useContext(LayoutContext);
};

export const useOrderDashboardContext = () => {
    return useContext(OrderDashboardContext);
};
