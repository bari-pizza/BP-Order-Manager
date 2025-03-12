import { test } from '@playwright/test';
import { CombinedPages } from '../pages/OrdersPage/CombinedOrdersPages';
import { Logger } from '../utils/Logger';

let combinedPages: CombinedPages;

// npx playwright test

test.beforeAll(async () => {
    Logger.startLog();
    Logger.setLogLevel('debug');
    combinedPages = await CombinedPages.create();
    await combinedPages.loginWithCredentials('jrajulialmeida@gmail.com', 'Password1234!');
});

test.afterAll(async () => {
    // Close all browsers after all tests
    await combinedPages.quitAllBrowsers();
});

test.only('End-to-end flow for managing a business day', async () => {
    test.setTimeout(1000 * 60 * 15);
    // add these methods to combined pages to make them prettier
    // maybe set managerPage and ordersPageMobile to protected
    await combinedPages.addDriversToDay(['Faker Test', 'Cedrick Catalan']);
    await combinedPages.initMobileBrowsers();
    await combinedPages.addMockOrders(20, 40);
    await combinedPages.assignOrders();
    await combinedPages.addMockTips();
    await combinedPages.closeAllDrawers();
    await combinedPages.closeDay();
    Logger.openLogFile();
});

// check that the UI matches the end state
// [ ] - all drawers are locked
// [ ] - all drivers have zero balance
// [ ] - show business day summary button
// [ ] - all orders should be locked
