import { Browser, BrowserContext, Locator, Page } from '@playwright/test';
import { OrdersPageBase } from './OrdersPageBase';
import { TicketPageMobile } from '../TicketPage/TicketPageMobile';
import { formatCurrency } from '../../../src/utils';
import { CombinedPages } from './CombinedOrdersPages';
import { Logger } from '../../utils/Logger';

// type OrderIdentifier = string | number;

export class OrdersPageMobile extends OrdersPageBase {
    protected ticketPage: TicketPageMobile;
    private speedDial: Locator = this.page.locator('[aria-label="SpeedDial"]');
    private addOrderButton: Locator = this.page.locator('[aria-label="Add Order"]');
    private speedDialExpanded: Locator = this.page.locator('[aria-label="SpeedDial"][aria-expanded="true"]');
    constructor(
        page: Page,
        context: BrowserContext,
        browser: Browser,
        combinedOrdersPages: CombinedPages,
        driver: {
            email: string;
            name: string;
        },
    ) {
        super(page, context, browser, combinedOrdersPages, driver);
        this.ticketPage = new TicketPageMobile(page);
    }

    async clickAddOrder() {
        await this.page.waitForTimeout(500); // couldnt get this to work without the timeout
        if (!(await this.addOrderButton.isVisible())) {
            await this.speedDial.click();
        }
        await this.addOrderButton.click();
        await this.page.waitForTimeout(500);
    }

    async createOrders(min: number, max: number) {
        await this.createRandomOrders(min, max, true);
    }

    async addTipsToAllOrders() {
        const orderTicketsCount = await this.page.locator('.order-ticket').count();
        for (let i = 0; i < orderTicketsCount; i++) {
            const tip = OrdersPageBase.generateRandomTip();
            const { nthTicket, orderData } = await this.ticketPage.getNthTicketAndOrder(i + 1);
            if (orderData.origin.can_tip) {
                await this.ticketPage.editTip(nthTicket, tip);
                await this.ticketPage.closeTicket();
                Logger.logInfo(
                    `Edited tip for order ${orderData.orderNumber || orderData.orderName} to ${formatCurrency(tip)}`,
                );
            }
        }
    }

    async addMockOrder() {
        // make sure we're on the right page
        await this.navigateToOrders();
        await this.createRandomOrders(1, 1, true);
    }

    async addMockOrders(min = 8, max = 15) {
        this.logInfo(`Driver adding mock orders`);
        // await this.mockRpcCreatedAt();
        await this.navigateToOrders();
        await this.createOrders(min, max);
    }

    async addMockTips() {
        this.logInfo(`Driver adding mock tips`);
        await this.navigateToOrders();
        await this.addTipsToAllOrders();
    }
}
