import { test, expect } from '@playwright/test';
import dayjs from 'dayjs';

test.only('handles midnight logic correctly', async ({ page }) => {
    // Mock the system time to 11:59:55 PM
    const mockTime = dayjs().hour(23).minute(59).second(55).toDate();
    await page.context().addInitScript((mockDate) => {
        // Override Date object
        const originalDate = Date;
        global.Date = class extends originalDate {
            constructor(...args: [number] | []) {
                super();
                if (args.length === 0) return new originalDate(mockDate);
                return new originalDate(...(args as [number]));
            }
            static now() {
                return new originalDate(mockDate).getTime();
            }
        } as DateConstructor;
    }, mockTime);

    // Navigate to the page
    await page.goto('http://localhost:5173');

    // Wait for the timeout to simulate midnight behavior
    await page.waitForTimeout(10000); // Adjust based on your timeout logic

    // Assert that the URL contains the updated business date
    const url = page.url();
    const yesterday = dayjs(mockTime).subtract(1, 'day').format('YYYY-MM-DD');
    expect(url).toContain(`businessDate=${yesterday}`);
});
