import { test } from '@playwright/test';
import { CombinedPages } from '../pages/OrdersPage/CombinedOrdersPages';
import { Logger } from '../utils/Logger';
import { getSeededDriverNames, seedBusinessDate, wipeBusinessDate } from '../utils/seed';
import { getManagerCredentials } from '../utils/testAccounts';
import { BasePage } from '../pages/BasePage/BasePage';

test.describe('Full business day', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async () => {
        Logger.startLog();
        Logger.setLogLevel('debug');
        await seedBusinessDate();
    });

    test.afterAll(async () => {
        await wipeBusinessDate();
    });

    test('End-to-end flow for managing a business day', async ({ page, context, browser }) => {
        test.setTimeout(1000 * 60 * 15);
        BasePage.todaysDrivers = [];
        CombinedPages.resetGeneratedOrders();

        const combinedPages = new CombinedPages(page, context, browser);
        const { email, password } = getManagerCredentials();
        await combinedPages.loginWithCredentials(email, password);
        await combinedPages.addDriversToDay(getSeededDriverNames());
        await combinedPages.initMobileBrowsers();
        await combinedPages.addMockOrders(20, 40);
        await combinedPages.assignOrders();
        await combinedPages.addMockTips();
        await combinedPages.closeAllDrawers();
        await combinedPages.closeDay();
        await combinedPages.quitMobileBrowsers();
        await Logger.openLogFile();
    });
});
