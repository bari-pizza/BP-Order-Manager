import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const today = dayjs();

export const useBusinessDate = (): [dayjs.Dayjs, (date: dayjs.Dayjs) => void] => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [businessDate, setBusinessDate] = useState<dayjs.Dayjs>(today);

    useEffect(() => {
        const dateString = searchParams.get('businessDate');
        const parsedDate = dayjs(dateString, 'YYYY-MM-DD', true);
        const isValidDate = parsedDate.isValid() && !parsedDate.isAfter(today);
        if (isValidDate) {
            setBusinessDate(parsedDate);
        } else if (dateString) {
            const urlSearchParams = new URLSearchParams(searchParams);
            urlSearchParams.delete('businessDate');
            setSearchParams(urlSearchParams);
        } else {
            setBusinessDate(today);
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const now = dayjs();
        const nextMidnight = now.add(1, 'day').startOf('day'); // Add 1 day and set time to midnight

        const timeUntilMidnight = nextMidnight.diff(now); // Calculate time difference in milliseconds

        const timeout = setTimeout(() => {
            const dateString = searchParams.get('businessDate');
            if (!dateString) {
                const yesterday = dayjs().subtract(1, 'day');
                setSearchParams({ businessDate: yesterday.format('YYYY-MM-DD') });
            }
        }, timeUntilMidnight);

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, [searchParams, setSearchParams]);

    const updateBusinessDate = (date: dayjs.Dayjs) => {
        if (date.isSame(today, 'day')) {
            const urlSearchParams = new URLSearchParams(searchParams);
            urlSearchParams.delete('businessDate');
            setSearchParams(urlSearchParams);
        } else {
            setSearchParams({ businessDate: date.format('YYYY-MM-DD') });
        }
    };

    return [businessDate, updateBusinessDate];
};
