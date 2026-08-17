import { expect, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test';
import type { OrderData } from '../../utils/data';
import { faker } from '@faker-js/faker/locale/en_US';
import { OrdersPageBase } from './OrdersPageBase';
import { TicketPageDesktop } from '../TicketPage/TicketPageDesktop';
import { CombinedPages } from './CombinedOrdersPages';

type DrawerIndentifier = string | number;
type OrderIdentifier = string | number;

export class OrdersPageDesktop extends OrdersPageBase {
    protected ticketPage: TicketPageDesktop;
    constructor(page: Page, context: BrowserContext, browser: Browser, combinedOrdersPages: CombinedPages) {
        super(page, context, browser, combinedOrdersPages);
        this.ticketPage = new TicketPageDesktop(page);
    }

    async clickAddOrder() {
        const editor = this.page.locator('.order-editor');
        if (await editor.isVisible()) {
            return;
        }
        await expect(this.page.locator('#add-order-button')).toBeVisible({ timeout: 15_000 });
        await this.page.locator('#add-order-button').click();
        await expect(editor).toBeVisible();
    }

    async getDriverCount() {
        return await this.page.locator('.MuiButton-outlined.drawer-card-button-driver').count();
    }

    // Get drawer by name or index (starting from 1)
    async getDrawer(identifier: DrawerIndentifier) {
        let drawerLocator: Locator | null = null;
        if (typeof identifier === 'string') {
            // If identifier is 'Selected', return the locator for the selected drawer
            if (identifier === 'selected') {
                drawerLocator = this.page.locator('.drawer-card-button.open-drawer');
            } else {
                // If identifier is a name, return the locator for the drawer by name
                drawerLocator = this.page.locator(`xpath=//*[contains(text(), '${identifier}')]/ancestor::button[1]`);
            }
        } else if (typeof identifier === 'number') {
            // If identifier is an index, return the locator for the drawer by index
            // return this.page.locator('.drawer-card-button').nth(identifier - 1);
            drawerLocator = this.page.locator('//button[contains(@class, "drawer-card-button")]').nth(identifier);
        } else {
            throw new Error('Cannot get drawer by identifier: ' + identifier);
        }
        return drawerLocator;
    }

    // Interact with a drawer by passing the drawer locator
    async clickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }

        await drawerLocator.click({ timeout: 5000, delay: 100 });
        await this.page.waitForTimeout(200);
    }

    async rightClickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await drawerLocator.click({ button: 'right' });
    }

    // Select or unselect an OrderTicket
    async selectOrderTicket(orderData: OrderData) {
        const ticket = await this.ticketPage.findTicketByOrderData(orderData);
        await this.ticketPage.toggleTicketSelection(ticket);
    }

    async unselectOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier}`);
    }

    async createOrders(min: number, max: number) {
        await this.createRandomOrders(min, max, false);
    }

    // Select all OrderTickets
    async selectAllTickets() {
        await this.page.click('text=SELECT ALL');
    }

    async hasUnassignedOrders() {
        const orderTicketCount = await this.page.locator('.order-ticket').count();
        const hasUnassignedOrders = orderTicketCount > 0;
        return hasUnassignedOrders;
    }

    async assignAllOrdersToRandomDrawers() {
        const unassignedDrawer = this.page.locator('.drawer-card-button-unassigned').first();
        const thirdPartyDrawers = this.page.locator('.drawer-card-button-third_party');
        const registerDrawers = this.page.locator('.drawer-card-button-register');
        const driverDrawers = this.page.locator('.drawer-card-button-driver');
        const registerCount = await registerDrawers.count();
        const driverCount = await driverDrawers.count();
        const thirdPartyCount = await thirdPartyDrawers.count();

        await this.clickDrawer(unassignedDrawer);

        let orderTicketsCount = await this.page.locator('.order-ticket').count();
        while (orderTicketsCount > 0) {
            const { lastTicket, orderData } = await this.ticketPage.getLastTicketAndOrder();
            const { orderType, origin } = orderData;
            const ticketLabel = orderData.orderNumber
                ? `Order #${orderData.orderNumber}`
                : orderData.orderName || 'ticket';
            const ticket = this.page.locator('.order-ticket').filter({ hasText: ticketLabel }).first();
            await this.ticketPage.toggleTicketSelection(lastTicket);

            if (orderType === 'pickup') {
                if (origin.is_third_party) {
                    if (thirdPartyCount === 0) {
                        throw new Error(`No third-party drawer to assign ${ticketLabel}`);
                    }
                    await this.clickDrawer(thirdPartyDrawers.nth(faker.number.int({ min: 0, max: thirdPartyCount - 1 })));
                } else {
                    if (registerCount === 0) {
                        throw new Error(`No register drawer to assign ${ticketLabel}`);
                    }
                    await this.clickDrawer(registerDrawers.nth(faker.number.int({ min: 0, max: registerCount - 1 })));
                }
            } else {
                if (driverCount === 0) {
                    throw new Error(`No driver drawer to assign ${ticketLabel}`);
                }
                await this.clickDrawer(driverDrawers.nth(faker.number.int({ min: 0, max: driverCount - 1 })));
            }

            const errorToast = this.page.locator('.Toastify__toast--error');
            await Promise.race([
                ticket.waitFor({ state: 'hidden', timeout: 15_000 }),
                errorToast.waitFor({ state: 'visible', timeout: 15_000 }),
            ]).catch(() => undefined);
            if (await errorToast.isVisible()) {
                throw new Error(`Assign ${ticketLabel} failed: ${await errorToast.innerText()}`);
            }
            await expect(ticket).toBeHidden({ timeout: 5_000 });
            await this.clickDrawer(unassignedDrawer);
            orderTicketsCount = await this.page.locator('.order-ticket').count();
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    async addMockOrder() {
        // make sure we're on the right page
        await this.navigateToOrders();
        await this.createRandomOrders(1, 1, false);
    }

    async addMockOrders(min = 30, max = 50) {
        this.logInfo(`Manager adding mock orders`);
        // await this.mockRpcCreatedAt();
        await this.navigateToOrders();
        await this.createOrders(min, max);
    }

    async assignOrders() {
        this.logInfo(`Manager assigning orders to random drawers`);
        await this.navigateToOrders();
        const editor = this.page.locator('.order-editor');
        if (await editor.isVisible()) {
            await editor.getByRole('button', { name: 'Cancel' }).click();
            await expect(editor).toBeHidden({ timeout: 10_000 });
        }
        await this.assignAllOrdersToRandomDrawers();
    }
}
