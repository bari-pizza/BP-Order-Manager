import { useContext, startTransition } from "react";
import { BusinessDateContext } from "../../context/BusinessDateContext";
import { Dialog, DialogContent } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

interface BusinessDatePickerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BusinessDatePicker = ({
  open,
  setOpen,
}: BusinessDatePickerProps) => {
  const { businessDate, setBusinessDate } = useContext(BusinessDateContext);

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
