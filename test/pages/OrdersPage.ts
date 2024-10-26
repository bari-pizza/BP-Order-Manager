import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

type DrawerIndentifier = string | number;
type OrderIdentifier = string | number;

export class OrdersPage extends BasePage {
    constructor(page: Page) {
        super(page);
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
            drawerLocator = this.page.locator('//button[contains(@class, "drawer-card-button")]').nth(identifier - 1);
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
        await drawerLocator.click();
        await this.page.waitForTimeout(1000);
    }

    async rightClickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await drawerLocator.click({ button: 'right' });
        await this.page.waitForTimeout(1000);
    }

    // Select or unselect an OrderTicket
    async selectOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier}`);
        await this.page.waitForTimeout(1000);
    }

    async unselectOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier}`);
        await this.page.waitForTimeout(1000);
    }

    // Open an OrderTicket for details
    async openOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier} >> .open-button-selector`);
        await this.page.waitForTimeout(1000);
    }

    // Select all OrderTickets
    async selectAllTickets() {
        await this.page.click('text=SELECT ALL');
        await this.page.waitForTimeout(1000);
    }

    // Add new order
    async addOrder() {
        await this.page.click('text=ADD ORDER');
        await this.page.waitForTimeout(1000);
    }

    // Assertion Methods
    async assertDrawerIsSelected(identifier: DrawerIndentifier) {
        const drawer = await this.getDrawer(identifier);
        expect(drawer).toHaveClass(/open-drawer/);
    }

    async assertOrderTicketSelected(orderNumber: string) {
        const ticket = this.page.locator(`text=${orderNumber}`);
        await expect(ticket).toHaveClass(/selected/);
    }

    async assertOrderAdded(orderNumber: string) {
        const addedOrder = this.page.locator(`text=${orderNumber}`);
        await expect(addedOrder).toBeVisible();
    }
}
