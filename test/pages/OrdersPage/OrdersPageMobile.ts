import { Locator, Page } from '@playwright/test';
import { OrdersPageBase } from './OrdersPageBase';
import { OrderData } from '../../utils/data';
import { TicketPageMobile } from '../TicketPage/TicketPageMobile';

// type OrderIdentifier = string | number;

export class OrdersPageMobile extends OrdersPageBase {
    protected ticketPage: TicketPageMobile;
    private speedDial: Locator = this.page.locator('[aria-label="SpeedDial"]');
    private addOrderButton: Locator = this.page.locator('[aria-label="Add Order"]');
    private speedDialExpanded: Locator = this.page.locator('[aria-label="SpeedDial"][aria-expanded="true"]');
    constructor(page: Page) {
        super(page);
        this.ticketPage = new TicketPageMobile(page);
    }

    async clickAddOrder() {
        await this.page.waitForTimeout(500); // couldnt get this to work without the timeout
        if (!(await this.addOrderButton.isVisible())) {
            await this.speedDial.click();
        }
        await this.addOrderButton.click();
    }

    async createOrders(min: number, max: number) {
        await this.createRandomOrders(min, max, true);
    }

    async addTipsToAllOrders() {
        const orderTicketsCount = await this.page.locator('.order-ticket').count();
        for (let i = 0; i < orderTicketsCount; i++) {
            const tip = OrdersPageBase.generateRandomTip();
            const { nthTicket } = await this.ticketPage.getNthTicketAndOrder(i + 1);
            await this.ticketPage.editTip(nthTicket, tip);
            await this.ticketPage.closeTicket();
        }
    }

    async editOrderTip(orderData: OrderData, tip_in_cents: number) {
        const ticket = await this.ticketPage.findTicketByOrderData(orderData);
        await this.ticketPage.editTip(ticket, tip_in_cents);
    }
}
