import { startTransition } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { useBusinessDate } from "./useBusinessDate";

interface BusinessDatePickerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BusinessDatePicker = ({
  open,
  setOpen,
}: BusinessDatePickerProps) => {
  const [businessDate, setBusinessDate] = useBusinessDate();

  const handleChange = (value: dayjs.Dayjs) => {
    setOpen(false);
    if (value) {
      startTransition(() => {
        setBusinessDate(value);
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <DateCalendar value={businessDate} onChange={handleChange} />
      </DialogContent>
      {/* <DialogActions>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};
