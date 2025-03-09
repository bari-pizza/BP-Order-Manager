import { Browser, BrowserContext, expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage/BasePage';
import { OrderData, orderOriginsWithTypes } from '../../utils/data';
import { Payment } from '../../../src/typesAndValidators';
import { formatCurrency } from '../../../src/utils';
import { Logger } from '../../utils/Logger';

export abstract class TicketPageBase extends BasePage {
    // protected orderEditor: Locator = this.page.locator('text=Order Editor').locator('..');
    protected orderEditor: Locator = this.page.locator('_react=OrderEditor');
    protected backDrop: Locator = this.page.locator('.MuiBackdrop-root.MuiModal-backdrop');
    protected driver: { email: string; name: string };
    constructor(page: Page, context: BrowserContext, browser: Browser, driver?: { email: string; name: string }) {
        super(page, context, browser);
        this.driver = driver || { email: 'email@missing.com', name: 'Name Missing' };
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
        const tipText = (await nthTicket.locator('.order-tips').textContent()) || '';

        // Parse and format the scraped data
        const origin = originClass?.match(/origin-logo-(.*)/)?.[1]?.replace(/\./g, ' ');
        const orderType = orderTypeClass?.match(/order-type-(.*)-icon/)?.[1];
        const total_in_cents = parseFloat(totalText?.replace('$', '')) * 100;
        const tip_in_cents = parseFloat(tipText?.replace('$', '')) * 100;

        if (!origin || !orderType || isNaN(total_in_cents)) throw new Error('Failed to parse order data');

        // Create the OrderData object
        const orderData = {
            orderNumber: orderNumber ? orderNumber.replace('Order #', '') : undefined,
            orderName: orderName || undefined,
            origin: orderOriginsWithTypes[origin as keyof typeof orderOriginsWithTypes].origin,
            orderType,
            total_in_cents: total_in_cents.toFixed(0),
            tip_in_cents: tip_in_cents.toFixed(0),
        };

        Logger.logInfo(`Scraped order data for order ${orderData?.orderNumber || orderData?.orderName}:`, orderData);

        return { nthTicket, orderData };
    }

    // Open ticket
    async openTicket(ticket: Locator) {
        // can click on ticket total to open
        await ticket.locator('.order-total').click();
        await expect(this.orderEditor).toBeVisible();
        await this.page.waitForTimeout(500);
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

    async editPayment(ticket: Locator, payment: Partial<Payment>, index = 0, failures = 0) {
        let hasChanges = false;
        await this.openTicketIfClosed(ticket);

        if (failures) await this.startTimeout(2, 'Handling error! ');

        // find and click on payment
        if (failures) await this.startTimeout(2, 'Will start editing payment in: ');
        await this.orderEditor.locator(`.payment-editor-edit-payment:nth-child(${index + 1})`).click();

        // click on payment type
        // handle payment amount

        // handle payment tip
        function isDefined<T>(value: T | undefined | null): value is T {
            return value !== undefined;
        }

        const paymentInput = this.orderEditor.locator(`.payment-tip-input input`);
        const formattedTip = isDefined(payment.tip_in_cents)
            ? formatCurrency(payment.tip_in_cents)
            : await paymentInput.inputValue();
        Logger.logInfo(`${this.driver.name} is Setting tip to ${formattedTip} (attempt: ${failures + 1})`);

        if (isDefined(payment.tip_in_cents)) {
            if ((await paymentInput.inputValue()) !== formattedTip) {
                hasChanges = true;
                if (failures) await this.startTimeout(3, `Setting tip to ${formattedTip} (attempt: ${failures + 1})`);
                await paymentInput.fill(payment.tip_in_cents.toString());
            }
        }

        // handle payment type

        // save
        if (hasChanges) {
            if (failures) await this.startTimeout(2, 'Will click save in: ');
            await this.orderEditor.locator('button:has-text("Save")').click();
            await expect(this.orderEditor.locator('.payment-editor-editing-payment')).not.toBeVisible();
            // confirm changes
            // if (isDefined(payment.tip_in_cents)) {
            // await this.startTimeout(4, 'Will confirm tip in: ');
            await expect(
                this.orderEditor.locator(`.payment-editor-edit-payment:nth-child(${index + 1}) .payment-tip-in-cents`),
            ).toHaveText(formattedTip);
            // }
        }
    }

    async editTip(ticket: Locator, tip_in_cents: number) {
        let failures = 0;
        let success = false;
        while (!success) {
            try {
                await this.editPayment(ticket, { tip_in_cents }, 0, failures);
                success = true;
            } catch (e) {
                failures++;
                if (failures > 3) {
                    this.logError(e, `${this.driver.name} failed to edit tip`);
                    return;
                }
            }
        }
    }
}
