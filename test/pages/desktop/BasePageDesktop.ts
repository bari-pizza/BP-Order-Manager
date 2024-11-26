import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasePageDesktop extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Common navigation methods
    async navigateToManager() {
        await this.navigateToHref('/manager');
    }

    // Common page methods (like waiting for elements)
    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }
}
