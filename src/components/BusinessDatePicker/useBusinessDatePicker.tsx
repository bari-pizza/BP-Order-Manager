import { useState } from 'react';
import { BusinessDatePicker } from './BusinessDatePicker';

export const useBusinessDatePicker = () => {
    const [open, setOpen] = useState(false);

    const picker = <BusinessDatePicker open={open} setOpen={setOpen} />;

    return {
        businessDatePicker: picker,
        showBusinessDatePicker: () => setOpen(true),
    };
};
