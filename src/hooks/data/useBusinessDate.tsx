import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from '../../toast/toastWrapper';

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

export const useMidnightEffect = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const now = dayjs();
        const midnight = dayjs().endOf('day');
        const timeUntilMidnight = midnight.diff(now);
        const oldDate = now.format('YYYY-MM-DD');

        const timeout = setTimeout(() => {
            const dateString = searchParams.get('businessDate');
            toast.info('It is now a new day!');

            if (!dateString) {
                toast.info('Updating the business date to yesterday.');
                setSearchParams({ businessDate: oldDate });
            }
        }, timeUntilMidnight);

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, [searchParams, setSearchParams]);
};
