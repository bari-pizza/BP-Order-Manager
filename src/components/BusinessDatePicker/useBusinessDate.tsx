import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const today = dayjs();

export const useBusinessDate = (): [
  dayjs.Dayjs,
  (date: dayjs.Dayjs) => void
] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businessDate, setBusinessDate] = useState<dayjs.Dayjs>(today);

  useEffect(() => {
    const date = searchParams.get("businessDate");
    if (date) {
      setBusinessDate(dayjs(date));
    }
  }, [searchParams]);

  const updateBusinessDate = (date: dayjs.Dayjs) => {
    if (date.isSame(today, "day")) {
      const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.delete("businessDate");
      setSearchParams(urlSearchParams);
    } else {
      setSearchParams({ businessDate: date.format("YYYY-MM-DD") });
    }
    setBusinessDate(date);
  };

  return [businessDate, updateBusinessDate];
};
