import { useContext, useState } from "react";
import { BusinessDatePicker } from "./BusinessDatePicker";
import { BusinessDateContext } from "../../context/BusinessDateContext";

export const useBusinessDatePicker = () => {
  const { businessDate, setBusinessDate } = useContext(BusinessDateContext);
  const [open, setOpen] = useState(false);

  const picker = <BusinessDatePicker open={open} setOpen={setOpen} />;
  return {
    businessDate,
    setBusinessDate,
    businessDatePicker: picker,
    showBusinessDatePicker: () => setOpen(true),
  };
};
