import { Page } from '@playwright/test';
import { OrdersPageBase } from './OrdersPageBase';
import { OrderData } from '../../utils/data';
import { TicketPageMobile } from '../TicketPage/TicketPageMobile';

// type OrderIdentifier = string | number;

export class OrdersPageMobile extends OrdersPageBase {
    constructor(page: Page) {
        super(page);
        this.ticketPage = new TicketPageMobile(page);
    }

    private async openSpeedDial() {
        const speedDial = this.page.locator('[aria-label="SpeedDial"]');
        await this.page.waitForTimeout(500);
        const isExpanded = await speedDial.getAttribute('aria-expanded');
        if (isExpanded === 'true') return;
        await speedDial.click();
    }

    async clickAddOrder() {
        await this.openSpeedDial();
        await this.page.locator('[aria-label="Add Order"]').click();
    }

    async createOrders(min: number, max: number) {
        await this.createRandomOrders(min, max, true);
    }

    async addTipsToAllOrders() {
        let orderTicketsCount = await this.page.locator('.order-ticket').count();
        while (orderTicketsCount > 0) {
            const tip = OrdersPageBase.generateRandomTip();
            const { lastTicket } = await this.ticketPage.getLastTicketAndOrder();
            await this.ticketPage.editTip(lastTicket, tip);
            orderTicketsCount = await this.page.locator('.order-ticket').count();
            this.ticketPage.closeTicket();
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    async editOrderTip(orderData: OrderData, tip_in_cents: number) {
        const ticket = await this.ticketPage.findTicketByOrderData(orderData);
        await this.ticketPage.editTip(ticket, tip_in_cents);
    }
}
