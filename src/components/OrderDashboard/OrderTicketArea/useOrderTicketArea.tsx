import { useState } from 'react';
import { OrderTicketArea } from './OrderTicketArea';
import type { Order } from '../../../typesAndValidators';
import { Button } from '@mui/material';

export const useOrderTicketArea = ({ orders }: { orders: Order[] }) => {
    const [collapsedTickets, setCollapsedTickets] = useState<string[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

    const toggleCollapsedTicket = (order: Order) => {
        setCollapsedTickets((prev) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((id) => id !== order.order_id);
            }
            return [...prev, order.order_id];
        });
    };

    const toggleSelectedTicket = (order: Order) => {
        setSelectedTickets((prev) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((id) => id !== order.order_id);
            }
            return [...prev, order.order_id];
        });
    };

    const toggleCollapseAllTickets = () => {
        if (collapsedTickets.length === orders?.length) {
            setCollapsedTickets([]);
        } else {
            setCollapsedTickets(orders?.map((order) => order.order_id) || []);
        }
    };

    const orderTicketArea = (
        <OrderTicketArea
            orders={orders}
            collapsedTickets={collapsedTickets}
            toggleCollapsedTicket={toggleCollapsedTicket}
            selectedTickets={selectedTickets}
            toggleSelectedTicket={toggleSelectedTicket}
        />
    );

    const toggleTicketsButton = (
        <Button variant="contained" onClick={toggleCollapseAllTickets}>
            {collapsedTickets.length === orders?.length ? 'Expand All' : 'Collapse All'} Tickets
        </Button>
    );

    // TODO: Add toggleSelectAllTickets
    // maybe redesign these to return button props instead of a button
    // would contain onClick, buttonText, variant, etc.

    return {
        orderTicketArea,
        toggleTicketsButton,
        selectedTickets,
        setSelectedTickets,
    };
};
