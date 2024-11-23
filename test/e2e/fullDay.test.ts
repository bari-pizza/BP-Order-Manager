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
    await managerPage.navigateToManager();
    await managerPage.navigateToTab('Drawers');
    await managerPage.addDriver('Cedrick Catalan');
    await managerPage.addDriver('Julia Catalan');
    // assert that all drivers are added
});

test('should add mock orders to the day', async () => {
    test.setTimeout(1000 * 60 * 5);
    await ordersPage.navigateToOrders();
    await ordersPage.createRandomOrders(5, 9);
});

test('should add orders to random drawers', async () => {
    test.setTimeout(1000 * 60 * 5);
    await ordersPage.navigateToOrders();
    // make sure its loaded
    console.log('Navigated to orders');
    await ordersPage.assignAllOrdersToRandomDrawers();
    // assert that there are no unassigned orders
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
