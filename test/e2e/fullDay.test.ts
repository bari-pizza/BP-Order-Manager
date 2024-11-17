import { test, chromium, Browser, BrowserContext } from '@playwright/test';
import { ManagerPage } from '../pages/ManagerPage';
import { OrdersPage } from '../pages/OrdersPage';

let browser: Browser;
let context: BrowserContext;
let managerPage: ManagerPage;
let ordersPage: OrdersPage;

// npx playwright test

test.beforeAll(async () => {
    // Start a single browser instance and context
    browser = await chromium.launch(); // or `chromium.launch({ headless: false })` for a visible browser
    context = await browser.newContext();
    const page = await context.newPage();

    // Initialize your page classes
    managerPage = new ManagerPage(page);
    ordersPage = new OrdersPage(page);

    // Perform common login for all tests
    await ordersPage.login();
});

test.afterAll(async () => {
    // Close the browser after all tests
    await context.close();
    await browser.close();
});

test('should add drivers to the day', async () => {
    // const managerPage = new ManagerPage(page);
    // await managerPage.login();
    await managerPage.navigateToManager();
    await managerPage.navigateToTab('Drawers');
    await managerPage.addDriver('Cedrick Catalan');
    await managerPage.addDriver('Julia Catalan');
});

test('should add mock orders to the day', async () => {
    test.setTimeout(1000 * 60 * 5);
    await ordersPage.navigateToOrders();
    await ordersPage.createRandomOrders(10, 15);
});

test('should add orders to random drawers', async () => {
    test.setTimeout(1000 * 60 * 5);
    await ordersPage.navigateToOrders();
    // make sure its loaded
    console.log('Navigated to orders');
    let hasUnassignedOrders = await ordersPage.hasUnassignedOrders();
    // go through every ticket (reverse order) and add it to a random drawer
    while (hasUnassignedOrders) {
        await ordersPage.assignOrderToRandomDrawer();
        hasUnassignedOrders = await ordersPage.hasUnassignedOrders();
        console.log(hasUnassignedOrders);
    }
});
test('should close out each driver', async () => {
    await managerPage.navigateToManager();
    await managerPage.navigateToTab('Drawers');
    await managerPage.closeDrawers();
});
//     test('should close out the day', async ({ page }) => {});
