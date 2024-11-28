import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage/BasePage';
import { OrderData, orderOriginsWithTypes } from '../../utils/data';
import { Payment } from '../../../src/typesAndValidators';

export abstract class TicketPageBase extends BasePage {
    // protected orderEditor: Locator = this.page.locator('text=Order Editor').locator('..');
    protected orderEditor: Locator = this.page.locator('_react=OrderEditor');
    protected backDrop: Locator = this.page.locator('.MuiBackdrop-root.MuiModal-backdrop');
    constructor(page: Page) {
        super(page);
    }

    // Find ticket based on order info (order_number, order_name, origin, order_type, payment_type, total_in_cents)
    public static async getTicketSelector(orderData: OrderData) {
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

        return ticketSelector;
    }

    async findTicketByOrderData(orderData: OrderData) {
        const ticketSelector = await TicketPageBase.getTicketSelector(orderData);
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

    async getNthTicketAndOrder(index: number) {
        // Select the last ticket element
        const nthTicket = this.page.locator(`.order-ticket:nth-child(${index})`);

        // Scrape the order data from the last ticket
        const orderNumberLocator = nthTicket.locator('.order-number');
        const orderNameLocator = nthTicket.locator('.order-name');
        const orderNumber = (await orderNumberLocator.count()) > 0 ? await orderNumberLocator.textContent() : undefined;
        const orderName = (await orderNameLocator.count()) > 0 ? await orderNameLocator.textContent() : undefined;
        const originClass = await nthTicket.locator('[class*="origin-logo-"]').getAttribute('class');
        const orderTypeClass = await nthTicket.locator('[class*="order-type-"]').getAttribute('class');
        const totalText = (await nthTicket.locator('.order-total').textContent()) || '';

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

        return { nthTicket, orderData };
    }

    // Open ticket
    async openTicket(ticket: Locator) {
        // can click on ticket total to open
        await ticket.locator('.order-total').click();
        await expect(this.orderEditor).toBeVisible();
    }

    async closeTicket() {
        await this.orderEditor.press('Escape');
        await expect(this.orderEditor).not.toBeVisible();
    }

    async openTicketIfClosed(ticket: Locator) {
        const isOpen = await this.orderEditor.isVisible();
        if (isOpen) return;
        await this.openTicket(ticket);
    }

    async editPayment(ticket: Locator, payment: Partial<Payment>, index = 0) {
        let hasChanges = false;
        await this.openTicketIfClosed(ticket);

        // find and click on payment
        await this.orderEditor.locator(`.payment-editor-edit-payment:nth-child(${index + 1})`).click();

        // click on payment type
        // handle payment amount
        // handle payment tip
        if (payment?.tip_in_cents !== undefined) {
            const paymentInput = this.orderEditor.locator(`.payment-tip-input input`);
            if ((await paymentInput.inputValue()) !== payment.tip_in_cents.toString()) {
                hasChanges = true;
                await paymentInput.fill(payment.tip_in_cents.toString());
            }
        }
        // handle payment type
        // save
        if (hasChanges) {
            await this.orderEditor.locator('button:has-text("Save")').click();
            await expect(this.orderEditor.locator('.payment-editor-editing-payment')).not.toBeVisible();
        }
    }

    async editTip(ticket: Locator, tip_in_cents: number) {
        await this.editPayment(ticket, { tip_in_cents });
    }
}
