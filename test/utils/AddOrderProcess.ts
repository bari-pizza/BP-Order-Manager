import { faker } from '@faker-js/faker/locale/en_US';
import { Page } from '@playwright/test';
import { OrderData, orderOriginsWithTypes } from './data';
import { OrderTicketActions } from './OrderTicketActions';

export class AddOrderProcess {
    private page: Page;
    private static currentOrderNumber = 0;
    private static generatedNames: Set<string> = new Set();
    private orderTicketActions: OrderTicketActions;

    constructor(page: Page) {
        this.page = page;
        this.orderTicketActions = new OrderTicketActions(page);
    }

    async startAddOrderProcess() {
        await this.page.locator('button.MuiButton-contained:has-text("Add Order")').click();
        // wait for any modals or transitions if necessary
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
        await orderTypeSelect.click();
        const optionText = orderType.charAt(0).toUpperCase() + orderType.slice(1);
        const dropdownOption = this.page.locator(`//li[text()='${optionText}']`);
        await dropdownOption.click();
    }

    async confirmOrder() {
        await this.page.click('text=Save');
    }

    public static generateUniqueOrderName(): string {
        let orderName: string;

        // Keep generating names until a unique one is found
        do {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const lastInitial = lastName.charAt(0).toUpperCase();
            orderName = `${firstName} ${lastInitial}.`;
        } while (AddOrderProcess.generatedNames.has(orderName)); // Check for uniqueness

        // Add the unique order name to the Set
        AddOrderProcess.generatedNames.add(orderName);

        return orderName;
    }

    public static generateOrderNumber() {
        AddOrderProcess.currentOrderNumber += 1;
        return AddOrderProcess.currentOrderNumber.toString();
    }

    public static generateRandomOrder() {
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
            // total_in_cents: faker.number.int({ min: 500, max: 12000 }),
            total_in_cents: AddOrderProcess.generateRightSkewedNumber(500, 12000, 1800),
        };

        return orderData;
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

    async setOrderNumber(orderNumber: string) {
        await this.page.fill('input[name="order_number"]', orderNumber);
    }

    async setOrderName(orderName: string) {
        await this.page.fill('input[name="order_name"]', orderName);
    }

    async setPaymentType(paymentType: OrderData['paymentType']) {
        const paymentTypeText = paymentType
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace('Third', '3rd');
        // const paymentTypeText = (paymentType.charAt(0).toUpperCase() + paymentType.slice(1)).split('_').join(' ');
        const paymentTypeButton = this.page.locator(`//button[text()='${paymentTypeText}']`);
        await paymentTypeButton.click();
    }

    async setTotalInCents(total_in_cents: number) {
        await this.page.locator(`//label[text()='Total']/following::input[1]`).fill(total_in_cents.toString());
    }

    async completeAddOrder() {
        const { origin, orderType, total_in_cents, paymentType } = AddOrderProcess.generateRandomOrder();

        await this.startAddOrderProcess();

        await this.chooseOrigin(origin.name);
        await this.chooseOrderType(orderType);
        let orderNumber: string | undefined;
        let orderName: string | undefined;
        if (origin.has_order_number) {
            orderNumber = AddOrderProcess.generateOrderNumber();
            await this.setOrderNumber(orderNumber);
        } else {
            orderName = AddOrderProcess.generateUniqueOrderName();
            await this.setOrderName(orderName);
        }
        await this.setTotalInCents(total_in_cents);
        await this.setPaymentType(paymentType);
        await this.confirmOrder();
    }
}
