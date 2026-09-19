import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/** Calendar “today” for business-date validation (not frozen at module load). */
export const getCalendarToday = (): Dayjs => dayjs();

/**
 * Parse a `businessDate` query value. Returns the dayjs date if valid and not after
 * `today` (by calendar day); otherwise null (caller should strip the param).
 */
export const parseBusinessDateParam = (dateString: string | null, today: Dayjs): Dayjs | null => {
    if (!dateString) return null;
    const parsedDate = dayjs(dateString, 'YYYY-MM-DD', true);
    if (parsedDate.isValid() && !parsedDate.isAfter(today, 'day')) {
        return parsedDate;
    }
    return null;
};
