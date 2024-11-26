import { test, chromium, Browser, BrowserContext, devices } from '@playwright/test';
import { ManagerPage } from '../pages/desktop/ManagerPage';
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

test('should add drivers to the day', async () => {
    await managerPage.navigateToManager();
    await managerPage.navigateToTab('Drawers');
    await managerPage.addDriver('Cedrick Catalan');
    await managerPage.addDriver('Julia Catalan');
    // assert that all drivers are added
});

test.only('should add mock orders to the day', async () => {
    test.setTimeout(1000 * 60 * 5);
    await ordersPageDesktop.navigateToOrders();
    await ordersPageDesktop.createOrders(5, 9);
});

test('should add orders to random drawers', async () => {
    test.setTimeout(1000 * 60 * 5);
    await ordersPageDesktop.navigateToOrders();
    await ordersPageDesktop.assignAllOrdersToRandomDrawers();
    // assert that there are no unassigned orders
});

test.skip('should allow drivers to add orders', async () => {
    test.setTimeout(1000 * 60 * 5);
    await ordersPageMobile.navigateToOrders();
    await ordersPageMobile.createOrders(5, 9);
});

test('should allow drivers to update orders', async () => {
    // assert that drivers can update orders
});

test('should close out all drawers', async () => {
    await managerPage.navigateToManager();
    await managerPage.navigateToTab('Drawers');
    await managerPage.closeDrawers();
    // assert that all drawers are closed
    // didnt close out the third party drawer
});

test('should close out the day', async () => {
    // assert that close day button appears
    // click it
    // dialog should open
    // will ask to confirm if all is good
    // otherwise will show issues
});
