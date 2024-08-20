import { useState } from 'react';
import { OrderTicketArea } from './OrderTicketArea';
import type { Order } from '../../../supabaseQueries';

export const useOrderTicketArea = ({ orders }: { orders: Order[] }) => {
    const [collapsedTickets, setCollapsedTickets] = useState<string[]>([]);

    const toggleTicket = (order: Order) => {
        setCollapsedTickets((prev) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((id) => id !== order.order_id);
            }
            return [...prev, order.order_id];
        });
    };

    const toggleAllTickets = () => {
        if (collapsedTickets.length === orders?.length) {
            setCollapsedTickets([]);
        } else {
            setCollapsedTickets(orders?.map((order) => order.order_id) || []);
        }
    };

    const orderTicketArea = (
        <OrderTicketArea orders={orders} collapsedTickets={collapsedTickets} toggleTicket={toggleTicket} />
    );

    return {
        orderTicketArea,
        toggleAllTickets,
    };
};
