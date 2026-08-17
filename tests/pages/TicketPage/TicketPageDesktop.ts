import type { Locator, Page } from '@playwright/test';
import { TicketPageBase } from './TicketPageBase';

export class TicketPageDesktop extends TicketPageBase {
    constructor(page: Page) {
        super(page);
    }

    // Toggle ticket selection
    async toggleTicketSelection(ticket: Locator) {
        const orderNumber = ticket.locator('.order-number');
        const orderName = ticket.locator('.order-name');
        const orderNumberCount = await orderNumber.count();
        const selectButton = (orderNumberCount === 1 ? orderNumber : orderName).locator('../../..');
        await selectButton.click({ timeout: 5000, delay: 100, force: true });
    }

    // Toggle select all tickets
    async toggleSelectAll() {
        const selectAllSelector = `data-test-id=select-all`;
        await this.page.click(selectAllSelector);
    }
}
