import { Page } from '@playwright/test';
import { BasePage } from '../BasePage/BasePage';
import { faker } from '@faker-js/faker/locale/en_US';
import { OrderData, orderOriginsWithTypes } from '../../utils/data';
import { TicketPageBase } from '../TicketPage/TicketPageBase';

export abstract class OrdersPageBase extends BasePage {
    private static currentOrderNumber = 0;
    private static generatedNames: Set<string> = new Set();
    protected ticketPage: TicketPageBase;

    constructor(page: Page) {
        super(page);
    }

    abstract clickAddOrder(): Promise<void>;

    abstract createOrders(min: number, max: number): Promise<void>;

    public static generateOrderNumber() {
        OrdersPageBase.currentOrderNumber += 1;
        return OrdersPageBase.currentOrderNumber.toString();
    }

    public static generateUniqueOrderName(): string {
        let orderName: string;

        // Keep generating names until a unique one is found
        do {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const lastInitial = lastName.charAt(0).toUpperCase();
            orderName = `${firstName} ${lastInitial}.`;
        } while (OrdersPageBase.generatedNames.has(orderName)); // Check for uniqueness

        // Add the unique order name to the Set
        OrdersPageBase.generatedNames.add(orderName);

        return orderName;
    }

    public static generateRandomOrder(isMobile: boolean) {
        if (isMobile) {
            const weightedOrderOrigins = [
                { weight: 0.25, value: 'Pizzamico' },
                { weight: 0.75, value: 'Bari Pizza' },
            ];
            const randomOriginKey = faker.helpers.weightedArrayElement(weightedOrderOrigins);
            const origin = orderOriginsWithTypes[randomOriginKey].origin;

            // Determine if we should generate an orderNumber or an orderName based on has_order_number
            const orderData: Omit<OrderData, 'orderNumber' | 'orderName'> = {
                origin: origin,
                orderType: 'delivery',
                paymentType: faker.helpers.arrayElement(orderOriginsWithTypes[randomOriginKey].validPayments),
                total_in_cents: OrdersPageBase.generateRightSkewedNumber(1400, 12000, 1800),
            };

            return orderData;
        } else {
            const weightedOrderOrigins = [
                { weight: 0.15, value: 'DoorDash' },
                { weight: 0.1, value: 'Pizzamico' },
                { weight: 0.75, value: 'Bari Pizza' },
            ];
            const randomOriginKey = faker.helpers.weightedArrayElement(weightedOrderOrigins);
            const origin = orderOriginsWithTypes[randomOriginKey].origin;

            // Determine if we should generate an orderNumber or an orderName based on has_order_number
            const orderData: Omit<OrderData, 'orderNumber' | 'orderName'> = {
                origin: origin,
                orderType: faker.helpers.arrayElement(orderOriginsWithTypes[randomOriginKey].validTypes),
                paymentType: faker.helpers.arrayElement(orderOriginsWithTypes[randomOriginKey].validPayments),
                total_in_cents: OrdersPageBase.generateRightSkewedNumber(500, 12000, 1800),
            };

            return orderData;
        }
    }

    public static generateRightSkewedNumber(min: number, max: number, mean: number) {
        // Generate a random number between 0 and 1
        const randomValue = Math.random();

        // Apply a transformation to create right skewness
        // Use a cubic transformation to skew towards the lower range
        const skewedValue = Math.pow(randomValue, 3); // Cubic for right skew

        // Scale the value to fit between min and max
        const scaledValue = skewedValue * (max - min) + min;

        // Adjust the value to lean towards the mean
        const adjustment = mean - min; // Distance from min to mean
        const adjustedValue = (scaledValue + adjustment) / 2; // Shift towards mean

        // Clamp the value between min and max
        return Math.floor(Math.min(max, Math.max(min, adjustedValue)));
    }

    public static generateRandomTip() {
        return OrdersPageBase.generateRightSkewedNumber(0, 1500, 300);
    }

    protected async createRandomOrders(min: number, max: number, isMobile: boolean) {
        const randomNumber = faker.number.int({ min: min, max: max });
        for (let i = 0; i < randomNumber; i++) {
            await this.addOrder(isMobile);
        }
    }

    async chooseOrigin(origin: OrderData['origin']['name']) {
        const originSelect = this.page.locator(`//label[text()='Origin']/following::div[1]`);
        // get originSelect text
        const initialValue = await originSelect.textContent();
        if (initialValue === origin + 'Origin') return;
        await originSelect.click();
        const dropdownOption = this.page.locator(`//li[text()='${origin}']`);
        await dropdownOption.click();
    }

    async chooseOrderType(orderType: OrderData['orderType']) {
        const orderTypeSelect = this.page.locator(`//label[text()='Order Type']/following::div[1]`);
        const className = await orderTypeSelect.getAttribute('class');
        if (className?.includes('Mui-disabled')) return;
        await orderTypeSelect.click();
        const optionText = orderType.charAt(0).toUpperCase() + orderType.slice(1);
        const dropdownOption = this.page.locator(`//li[text()='${optionText}']`);
        await dropdownOption.click();
    }

    async setOrderNumber(orderNumber: string) {
        await this.page.locator('input[name="order_number"]').fill(orderNumber);
    }

    async setOrderName(orderName: string) {
        await this.page.locator('input[name="order_name"]').fill(orderName);
    }

    async setPaymentType(paymentType: OrderData['paymentType']) {
        const paymentTypeText = paymentType
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace('Third', '3rd');
        const paymentTypeButton = this.page.locator(`//button[text()='${paymentTypeText}']`);
        await paymentTypeButton.click();
    }

    async setTotalInCents(total_in_cents: number) {
        await this.page.locator(`//label[text()='Total']/following::input[1]`).fill(total_in_cents.toString());
    }

    async addOrder(isMobile: boolean) {
        const { origin, orderType, total_in_cents, paymentType } = OrdersPageBase.generateRandomOrder(isMobile);

        await this.clickAddOrder();

        await this.chooseOrigin(origin.name);
        await this.chooseOrderType(orderType);
        let orderNumber: string | undefined;
        let orderName: string | undefined;
        if (origin.has_order_number) {
            orderNumber = OrdersPageBase.generateOrderNumber();
            await this.setOrderNumber(orderNumber);
        } else {
            orderName = OrdersPageBase.generateUniqueOrderName();
            await this.setOrderName(orderName);
        }
        await this.setTotalInCents(total_in_cents);
        await this.setPaymentType(paymentType);
        await this.confirmOrder();
    }

    async confirmOrder() {
        await this.page.locator('text=Save').click();
    }
}
