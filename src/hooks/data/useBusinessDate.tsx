import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from '../../toast/toastWrapper';
import { getCalendarToday, parseBusinessDateParam } from './businessDate';

export { getCalendarToday, parseBusinessDateParam } from './businessDate';

/**
 * Keeps a live calendar-day value across long-lived PWA sessions.
 * Refreshes at local midnight and when the tab regains focus/visibility.
 */
export const useCalendarToday = (): Dayjs => {
    const [today, setToday] = useState<Dayjs>(() => getCalendarToday());

    const refresh = useCallback(() => {
        setToday((prev) => {
            const next = getCalendarToday();
            return prev.isSame(next, 'day') ? prev : next;
        });
    }, []);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const scheduleMidnight = () => {
            const msUntilNextDay = dayjs().endOf('day').diff(dayjs()) + 50;
            timeoutId = setTimeout(() => {
                refresh();
                scheduleMidnight();
            }, Math.max(msUntilNextDay, 50));
        };

        scheduleMidnight();

        const onFocus = () => refresh();
        const onVisibility = () => {
            if (document.visibilityState === 'visible') refresh();
        };

        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [refresh]);

    return today;
};

export const useBusinessDate = (): [Dayjs, (date: Dayjs) => void] => {
    const [searchParams, setSearchParams] = useSearchParams();
    const today = useCalendarToday();
    const [businessDate, setBusinessDate] = useState<Dayjs>(() => getCalendarToday());

    useEffect(() => {
        const dateString = searchParams.get('businessDate');
        const parsedDate = parseBusinessDateParam(dateString, today);
        if (parsedDate) {
            setBusinessDate(parsedDate);
        } else if (dateString) {
            const urlSearchParams = new URLSearchParams(searchParams);
            urlSearchParams.delete('businessDate');
            setSearchParams(urlSearchParams);
        } else {
            setBusinessDate(today);
        }
    }, [searchParams, setSearchParams, today]);

    const updateBusinessDate = (date: Dayjs) => {
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

        return () => clearTimeout(timeout);
    }, [searchParams, setSearchParams]);
};
