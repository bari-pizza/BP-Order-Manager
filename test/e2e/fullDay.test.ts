import { test, chromium, Browser, BrowserContext, devices } from '@playwright/test';
import { ManagerPage } from '../pages/Desktop/ManagerPage';
import { OrdersPageDesktop } from '../pages/OrdersPage/OrdersPageDesktop';
import { OrdersPageMobile } from '../pages/OrdersPage/OrdersPageMobile';

let desktopBrowser: Browser;
let desktopContext: BrowserContext;
let mobileBrowser: Browser;
let mobileContext: BrowserContext;
let managerPage: ManagerPage;
let ordersPageDesktop: OrdersPageDesktop;
let ordersPageMobile: OrdersPageMobile;

const iPhone = devices['iPhone 11']; // Mobile emulation for iPhone 11

// npx playwright test

test.beforeAll(async () => {
    // Start a single browser instance and context
    desktopBrowser = await chromium.launch(); // or `chromium.launch({ headless: false })` for a visible browser
    desktopContext = await desktopBrowser.newContext();
    const desktopPage = await desktopContext.newPage();
    managerPage = new ManagerPage(desktopPage);
    ordersPageDesktop = new OrdersPageDesktop(desktopPage);
    await ordersPageDesktop.login();

    mobileBrowser = await chromium.launch({ headless: false });
    mobileContext = await mobileBrowser.newContext({
        ...iPhone,
    });
    const mobilePage = await mobileContext.newPage();
    ordersPageMobile = new OrdersPageMobile(mobilePage);
    await ordersPageMobile.login();
});

test.afterAll(async () => {
    // Close the browser after all tests
    await desktopContext.close();
    await desktopBrowser.close();

    await mobileContext.close();
    await mobileBrowser.close();
});

test('End-to-end flow for managing a business day', async () => {
    test.setTimeout(1000 * 60 * 15);
    await test.step('add drivers to the day', async () => {
        managerPage.logInfo('Adding drivers');
        await managerPage.navigateToManager();
        await managerPage.navigateToTab('Drawers');
        await managerPage.addDriver('Julia Catalan');
        await managerPage.addDriver('Cedrick Catalan');
        // assert that all drivers are added
    });

    await test.step('should add mock orders to the day', async () => {
        managerPage.logInfo('Manager adding mock orders');
        // test.setTimeout(1000 * 60 * 10);
        await ordersPageDesktop.navigateToOrders();
        await ordersPageDesktop.createOrders(30, 50);
    });

    await test.step('should allow drivers to add orders', async () => {
        ordersPageMobile.logInfo('Driver adding orders');
        // test.setTimeout(1000 * 60 * 10);
        await ordersPageMobile.navigateToOrders();
        await ordersPageMobile.createOrders(8, 15);
    });

    await test.step('should add orders to random drawers', async () => {
        ordersPageDesktop.logInfo('Manager assigning orders to random drawers');
        // test.setTimeout(1000 * 60 * 10);
        await ordersPageDesktop.navigateToOrders();
        await ordersPageDesktop.assignAllOrdersToRandomDrawers();
        // assert that there are no unassigned orders
    });

    await test.step('should allow drivers to update orders (tips)', async () => {
        ordersPageMobile.logInfo('Driver updating tips');
        // test.setTimeout(1000 * 60 * 10);
        await ordersPageMobile.navigateToOrders();
        await ordersPageMobile.addTipsToAllOrders();
    });

    await test.step('should close out all drawers', async () => {
        managerPage.logInfo('Manager closing out all drawers');
        // test.setTimeout(1000 * 60 * 10);
        await managerPage.navigateToManager();
        await managerPage.navigateToTab('Drawers');
        await managerPage.closeDrawers();
        // assert that all drawers are closed
        // didnt close out the third party drawer
    });

    await test.step('should close out the day', async () => {
        // assert that close day button appears
        managerPage.logInfo('Manager closing out the day');
        await managerPage.navigateToManager();
        await managerPage.navigateToTab('Drawers');
        await managerPage.closeBusinessDay();
    });
});

// test('should add drivers to the day', async () => {
//     managerPage.logInfo('Adding drivers');
//     await managerPage.navigateToManager();
//     await managerPage.navigateToTab('Drawers');
//     await managerPage.addDriver('Julia Catalan');
//     await managerPage.addDriver('Cedrick Catalan');
//     // assert that all drivers are added
// });

// test('should add mock orders to the day', async () => {
//     managerPage.logInfo('Manager adding mock orders');
//     test.setTimeout(1000 * 60 * 10);
//     await ordersPageDesktop.navigateToOrders();
//     await ordersPageDesktop.createOrders(50, 80);
// });

// test('should allow drivers to add orders', async () => {
//     ordersPageMobile.logInfo('Driver adding orders');
//     test.setTimeout(1000 * 60 * 10);
//     await ordersPageMobile.navigateToOrders();
//     await ordersPageMobile.createOrders(8, 15);
// });

// test('should add orders to random drawers', async () => {
//     ordersPageDesktop.logInfo('Manager assigning orders to random drawers');
//     test.setTimeout(1000 * 60 * 10);
//     await ordersPageDesktop.navigateToOrders();
//     await ordersPageDesktop.assignAllOrdersToRandomDrawers();
//     // assert that there are no unassigned orders
// });

// test('should allow drivers to update orders (tips)', async () => {
//     ordersPageMobile.logInfo('Driver updating tips');
//     test.setTimeout(1000 * 60 * 10);
//     await ordersPageMobile.navigateToOrders();
//     await ordersPageMobile.addTipsToAllOrders();
// });

// test('should close out all drawers', async () => {
//     managerPage.logInfo('Manager closing out all drawers');
//     test.setTimeout(1000 * 60 * 10);
//     await managerPage.navigateToManager();
//     await managerPage.navigateToTab('Drawers');
//     await managerPage.closeDrawers();
//     // assert that all drawers are closed
//     // didnt close out the third party drawer
// });

// test('should close out the day', async () => {
//     // assert that close day button appears
//     managerPage.logInfo('Manager closing out the day');
//     await managerPage.navigateToManager();
//     await managerPage.navigateToTab('Drawers');
//     await managerPage.closeBusinessDay();
// });

// check that the UI matches the end state
// [ ] - all drawers are locked
// [ ] - all drivers have zero balance
// [ ] - show business day summary button
// [ ] - all orders should be locked
