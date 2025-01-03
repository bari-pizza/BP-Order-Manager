import { Page } from '@playwright/test';
import { TicketPageBase } from './TicketPageBase';

export class TicketPageMobile extends TicketPageBase {
    constructor(page: Page) {
        super(page);
    }
}
