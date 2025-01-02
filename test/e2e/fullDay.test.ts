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
    await managerPage.addDriversToDay();
    await ordersPageDesktop.addMockOrders(60, 80);
    await ordersPageMobile.addMockOrders(15, 20);
    await ordersPageDesktop.assignOrders();
    await ordersPageMobile.addMockTips();
    await managerPage.closeAllDrawers();
    await managerPage.closeDay();
    managerPage.openLogger();
});

// check that the UI matches the end state
// [ ] - all drawers are locked
// [ ] - all drivers have zero balance
// [ ] - show business day summary button
// [ ] - all orders should be locked
