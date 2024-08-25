import { useState } from 'react';
import { Order } from '../../../typesAndValidators';
import { OrderEditor } from './OrderEditor';
import { Button } from '@mui/material';

interface UseOrderEditorProps {
    order?: Order;
    asDialog?: boolean;
}

export const useOrderEditor = ({ order, asDialog }: UseOrderEditorProps = {}) => {
    const [open, setOpen] = useState(false);

    const orderEditor = <OrderEditor open={open} setOpen={setOpen} order={order} asDialog={asDialog} />;

    const addOrderButton = !open && (
        <Button variant="contained" onClick={() => setOpen(true)}>
            Add Order
        </Button>
    );

    return {
        orderEditor,
        addOrderButton,
        setOpen,
    };
};
