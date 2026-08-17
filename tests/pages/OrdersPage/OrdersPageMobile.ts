import { expect, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test';
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
        const editor = this.page.locator('.order-editor');
        if (await editor.isVisible()) {
            return;
        }
        await this.waitForToastsToClear();
        if (!(await this.speedDialExpanded.isVisible())) {
            await this.speedDial.tap();
            await expect(this.speedDialExpanded).toBeVisible({ timeout: 10_000 });
        }
        await this.page.getByRole('menuitem', { name: 'Add Order' }).tap();
        await expect(editor).toBeVisible({ timeout: 10_000 });
    }

    async createOrders(min: number, max: number) {
        await this.createRandomOrders(min, max, true);
    }

    async addTipsToAllOrders() {
        await this.waitForToastsToClear();
        await this.page.evaluate(() => {
            document.querySelectorAll('.Toastify').forEach((el) => {
                (el as HTMLElement).style.pointerEvents = 'none';
            });
        });
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
