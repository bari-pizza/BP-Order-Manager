import { Page } from '@playwright/test';
import { OrdersPageBase } from './OrdersPageBase';
import { OrderTicketActions } from '../../utils/OrderTicketActions';

type OrderIdentifier = string | number;

export class OrdersPageMobile extends OrdersPageBase {
    private orderTicketActions: OrderTicketActions;

    constructor(page: Page) {
        super(page);
        this.orderTicketActions = new OrderTicketActions(this.page);
    }

    private async openSpeedDial() {
        await this.page.locator('aria-label=SpeedDial').click();
    }

    async clickAddOrder() {
        await this.openSpeedDial();
        await this.page.locator('aria-label=Add Order').click();
    }

    async createOrders(min: number, max: number) {
        this.createRandomOrders(min, max, true);
    }

    // Open an OrderTicket for details
    async openOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier} >> .open-button-selector`);
    }
}
