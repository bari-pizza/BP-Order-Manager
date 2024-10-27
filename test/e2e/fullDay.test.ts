import { test, chromium, Browser, BrowserContext } from '@playwright/test';
import { ManagerPage } from '../pages/ManagerPage';
import { OrdersPage } from '../pages/OrdersPage';
import { orderOriginsWithTypes } from '../utils/data';

let browser: Browser;
let context: BrowserContext;
let managerPage: ManagerPage;
let ordersPage: OrdersPage;

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

test.only('should add drivers to the day', async () => {
    // const managerPage = new ManagerPage(page);
    // await managerPage.login();
    await managerPage.navigateToManager();
    await managerPage.navigateToTab('Drawers');
    await managerPage.addDriver('Cedrick Catalan');
    await managerPage.addDriver('Julia Catalan');
});
test('should add about 80 mock orders to the day', async () => {
    await ordersPage.navigateToOrders();
    // const doordash = orderOriginsWithTypes['DoorDash'].origin;
    // await ordersPage.addOrder({
    //     origin: doordash,
    //     total_in_cents: 1523,
    //     paymentType: 'third_party',
    //     orderType: 'pickup',
    // });
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
    await ordersPage.addOrder();
});
//     test('should assign orders to drivers', async ({ page }) => {});
//     test('should close out each driver', async ({ page }) => {});
//     test('should close out the day', async ({ page }) => {});
