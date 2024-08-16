import { createContext } from "react";
import dayjs from "dayjs";

interface BusinessDateContextProps {
  businessDate: dayjs.Dayjs;
  setBusinessDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}

export const BusinessDateContext = createContext<BusinessDateContextProps>({
  businessDate: dayjs(),
  setBusinessDate: () => {},
});
