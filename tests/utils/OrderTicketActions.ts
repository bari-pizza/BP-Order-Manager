import { expect, type Locator, type Page } from '@playwright/test';
import { orderOriginsWithTypes, type OrderData } from './data';

export class OrderTicketActions {
    // find ticket based on order info (order_number, order_name, origin, order_type, payment_type, total_in_cents)

    // open ticket

    // toggle ticket selection
    // toggle select all

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Find ticket based on order info (order_number, order_name, origin, order_type, payment_type, total_in_cents)
    async findTicket(orderData: OrderData) {
        const { orderNumber, orderName, origin, orderType, total_in_cents } = orderData;

        let ticketSelector = `.order-ticket`;

        // Add selectors conditionally
        if (orderNumber) {
            ticketSelector += `:has(.order-number:text-is("Order #${orderNumber}"))`;
        } else if (orderName) {
            ticketSelector += `:has(.order-name:text-is("${orderName}"))`;
        }

        ticketSelector += `:has(.order-type-${orderType}-icon)`;
        ticketSelector += `:has(.origin-logo-${origin.name.split(' ').join('.')})`;
        ticketSelector += `:has(.order-total:text-is("$${(total_in_cents / 100).toFixed(2)}"))`;

        await expect(this.page.locator(ticketSelector)).toBeVisible();
        return this.page.locator(ticketSelector);
    }

    async getLastTicketAndOrder() {
        // Select the last ticket element
        const lastTicketSelector = `.order-ticket:last-of-type`;
        const lastTicket = this.page.locator(lastTicketSelector);

        // Scrape the order data from the last ticket
        const orderNumberLocator = lastTicket.locator('.order-number');
        const orderNameLocator = lastTicket.locator('.order-name');
        const orderNumber = (await orderNumberLocator.count()) > 0 ? await orderNumberLocator.textContent() : undefined;
        const orderName = (await orderNameLocator.count()) > 0 ? await orderNameLocator.textContent() : undefined;
        const originClass = await lastTicket.locator('[class*="origin-logo-"]').getAttribute('class');
        const orderTypeClass = await lastTicket.locator('[class*="order-type-"]').getAttribute('class');
        const totalText = (await lastTicket.locator('.order-total').textContent()) || '';

        // Parse and format the scraped data
        const origin = originClass?.match(/origin-logo-(.*)/)?.[1]?.replace(/\./g, ' ');
        const orderType = orderTypeClass?.match(/order-type-(.*)-icon/)?.[1];
        const total_in_cents = parseFloat(totalText?.replace('$', '')) * 100;

        if (!origin || !orderType || isNaN(total_in_cents)) throw new Error('Failed to parse order data');

        // Create the OrderData object
        const orderData = {
            orderNumber: orderNumber ? orderNumber.replace('Order #', '') : undefined,
            orderName: orderName || undefined,
            origin: orderOriginsWithTypes[origin as keyof typeof orderOriginsWithTypes].origin,
            orderType,
            total_in_cents,
        };

        return { lastTicket, orderData };
    }

    // Open ticket
    async openTicket(ticket: Locator) {
        if (!ticket) throw new Error('Ticket not found. Please call findTicket first.');
        // can click on ticket total to open
        await ticket.locator('.order-total').click();
        // check that order editor has opened
        await expect(this.page.locator('text=Order Editor')).toBeVisible();
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
