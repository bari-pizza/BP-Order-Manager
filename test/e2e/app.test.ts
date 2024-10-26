import { test, expect } from '@playwright/test';
import { OrdersPage } from '../pages/OrdersPage';

test('homepage has title and links', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Assert that the page title is correct
    await expect(page).toHaveTitle(/Bari Pizza Order Manager/);

    // Check if a home link is visible
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
});

test.describe('Orders Page Tests', () => {
    let ordersPage: OrdersPage;

    test.beforeEach(async ({ page }) => {
        // Navigate to the orders page before each test
        ordersPage = new OrdersPage(page);
        // wait one second
        await ordersPage.waitForTimeout(1000);
        await ordersPage.login();
        await ordersPage.navigateToOrders();
        await page.waitForTimeout(2000);
    });

    test.only('should click a drawer by name', async () => {
        const drawerName = 'Drawer 1';
        const drawer = await ordersPage.getDrawer(drawerName);

        await ordersPage.clickDrawer(drawer);

        // Add your assertions here
        await ordersPage.assertDrawerIsSelected(drawerName);
    });

    test('should click a drawer by index', async () => {
        const drawerIndex = 3; // Adjust as necessary
        const drawer = await ordersPage.getDrawer(drawerIndex);

        await ordersPage.clickDrawer(drawer);

        // Add your assertions here
    });

    test('should select an order ticket', async () => {
        const orderNumber = '12345';
        await ordersPage.selectOrderTicket(orderNumber);

        // Add your assertions here
    });

    test('should add a new order', async () => {
        await ordersPage.addOrder();

        // Add your assertions here, e.g., checking if a new order was added
    });

    // Additional tests can be added here...
});
