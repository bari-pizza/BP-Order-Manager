import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasePageDesktop extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Common navigation methods
    async navigateToManager() {
        await this.navigateToHref('/manager');
        // make sure page has loaded
        await expect(this.page.locator('_react=ManagerDashboard').nth(0)).toBeVisible();
    }
}
