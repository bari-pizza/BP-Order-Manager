import {
    // Locator,
    Page,
} from '@playwright/test';
import { BasePageMobile } from './BasePageMobile';
import { AddOrderProcess } from '../../utils/AddOrderProcess';
// import { OrderData } from '../../utils/data';
import { OrderTicketActions } from '../../utils/OrderTicketActions';
import { faker } from '@faker-js/faker/locale/en_US';

type OrderIdentifier = string | number;

export class OrdersPageMobile extends BasePageMobile {
    private addOrderProcess: AddOrderProcess;
    private orderTicketActions: OrderTicketActions;

    constructor(page: Page) {
        super(page);
        this.addOrderProcess = new AddOrderProcess(this.page, true);
        this.orderTicketActions = new OrderTicketActions(this.page);
    }

    // Open an OrderTicket for details
    async openOrderTicket(orderIdentifier: OrderIdentifier) {
        await this.page.click(`text=${orderIdentifier} >> .open-button-selector`);
    }

    // Add new order
    async addOrder() {
        await this.addOrderProcess.completeAddOrder();
    }

    async createRandomOrders(min: number, max: number) {
        const randomNumber = faker.number.int({ min: min, max: max });
        for (let i = 0; i < randomNumber; i++) {
            await this.addOrderProcess.completeAddOrder();
        }
    }
}
