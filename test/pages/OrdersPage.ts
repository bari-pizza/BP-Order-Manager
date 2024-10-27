import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { AddOrderProcess } from '../utils/processes';
import { OrderData } from '../utils/data';

type DrawerIndentifier = string | number;
type OrderIdentifier = string | number;

export class OrdersPage extends BasePage {
    private addOrderProcess: AddOrderProcess;

    constructor(page: Page) {
        super(page);
        this.addOrderProcess = new AddOrderProcess(this.page);
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
        const originallyOpen = (await drawerLocator.getAttribute('class'))?.includes('open-drawer');
        await drawerLocator.click();

        if (originallyOpen) {
            await expect(drawerLocator).not.toHaveClass(/open-drawer/);
        } else {
            await expect(drawerLocator).toHaveClass(/open-drawer/);
        }
    }

    async rightClickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await drawerLocator.click({ button: 'right' });
    }

    // Select or unselect an OrderTicket
    async selectOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier}`);
    }

    async unselectOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier}`);
    }

    // Open an OrderTicket for details
    async openOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier} >> .open-button-selector`);
    }

    // Select all OrderTickets
    async selectAllTickets() {
        await this.page.click('text=SELECT ALL');
    }

    // Add new order
    async addOrder(orderData?: Omit<OrderData, 'orderNumber' | 'orderName'>) {
        await this.addOrderProcess.completeAddOrder(orderData || null);
    }
}
