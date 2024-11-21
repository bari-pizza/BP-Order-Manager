import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { AddOrderProcess } from '../utils/AddOrderProcess';
import { OrderData } from '../utils/data';
import { OrderTicketActions } from '../utils/OrderTicketActions';
import { faker } from '@faker-js/faker/locale/en_US';

type DrawerIndentifier = string | number;
type OrderIdentifier = string | number;

export class OrdersPage extends BasePage {
    private addOrderProcess: AddOrderProcess;
    private orderTicketActions: OrderTicketActions;

    constructor(page: Page) {
        super(page);
        this.addOrderProcess = new AddOrderProcess(this.page);
        this.orderTicketActions = new OrderTicketActions(this.page);
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
        // const originallyOpen = (await drawerLocator.getAttribute('class'))?.includes('open-drawer');
        await drawerLocator.click({ timeout: 5000, delay: 100 });

        // if (originallyOpen) {
        //     await expect(drawerLocator).not.toHaveClass(/open-drawer/);
        // } else {
        //     await expect(drawerLocator).toHaveClass(/open-drawer/);
        // }
    }

    async rightClickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await drawerLocator.click({ button: 'right' });
    }

    // Select or unselect an OrderTicket
    async selectOrderTicket(orderData: OrderData) {
        const ticket = await this.orderTicketActions.findTicket(orderData);
        await this.orderTicketActions.toggleTicketSelection(ticket);
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
    async addOrder() {
        await this.addOrderProcess.completeAddOrder();
    }

    async createRandomOrders(min: number, max: number) {
        const randomNumber = faker.number.int({ min: min, max: max });
        for (let i = 0; i < randomNumber; i++) {
            await this.addOrderProcess.completeAddOrder();
        }
    }
    async hasUnassignedOrders() {
        const orderTicketCount = await this.page.locator('.order-ticket').count();
        const hasUnassignedOrders = orderTicketCount > 0;
        return hasUnassignedOrders;
    }

    async assignAllOrdersToRandomDrawers() {
        // make sure we're on unassigned orders
        const unassignedDrawer = await this.getDrawer('Unassigned');
        const thirdPartyDrawer = await this.getDrawer('Third Party Pickup');
        const registerDrawer1 = await this.getDrawer('Drawer 1');
        const registerDrawer2 = await this.getDrawer('Drawer 2');
        const driverCount = await this.getDriverCount();
        const driverDrawers: Locator[] = [];
        for (let i = 0; i < driverCount; i++) {
            const driverDrawer = await this.getDrawer(i + 4);
            driverDrawers.push(driverDrawer);
        }
        await this.clickDrawer(unassignedDrawer);
        const orderTicketsCount = await this.page.locator('.order-ticket').count();
        console.log({ orderTicketsCount });
        for (let i = 0; i < orderTicketsCount; i++) {
            const { lastTicket, orderData } = await this.orderTicketActions.getLastTicketAndOrder();
            const { orderType, origin } = orderData;
            await this.orderTicketActions.toggleTicketSelection(lastTicket);
            if (orderType === 'pickup') {
                if (origin.is_third_party) {
                    await this.clickDrawer(thirdPartyDrawer);
                } else {
                    const randomDrawer = faker.number.int({ min: 1, max: 2 });
                    if (randomDrawer === 1) {
                        await this.clickDrawer(registerDrawer1);
                    } else if (randomDrawer === 2) {
                        await this.clickDrawer(registerDrawer2);
                    }
                }
            } else {
                if (driverCount === 0) return;
                const driverIndex = faker.number.int({ min: 0, max: driverCount - 1 });
                await this.clickDrawer(driverDrawers[driverIndex]);
            }
            await this.clickDrawer(unassignedDrawer);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}
