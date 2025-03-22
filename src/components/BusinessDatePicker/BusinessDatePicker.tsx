import { startTransition } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { useBusinessDate } from '../../hooks/data/useBusinessDate';
import { m } from '../../paraglide/messages';

interface BusinessDatePickerProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BusinessDatePicker = ({ open, setOpen }: BusinessDatePickerProps) => {
    const [businessDate, setBusinessDate] = useBusinessDate();

    const handleChange = (value: dayjs.Dayjs) => {
        setOpen(false);
        if (value) {
            startTransition(() => {
                setBusinessDate(value);
            });
        }
    };

    // MuiPickersCalendarHeader-label css-dplwbx-MuiPickersCalendarHeader-label

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle textTransform={'capitalize'}>{m.selectBusinessDate()}</DialogTitle>
            <DialogContent>
                <DateCalendar
                    showDaysOutsideCurrentMonth
                    slotProps={{ calendarHeader: { sx: { textTransform: 'capitalize' } } }}
                    value={businessDate}
                    onChange={handleChange}
                    disableFuture
                />
            </DialogContent>
        </Dialog>
    );
};
