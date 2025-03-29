import { Browser, BrowserContext, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasePageDesktop extends BasePage {
    constructor(page: Page, context: BrowserContext, browser: Browser) {
        super(page, context, browser);
    }

    // Common navigation methods
    async navigateToManager() {
        await this.navigateToHref('/manager');
        // make sure page has loaded
        await expect(this.page.locator('.manager-dashboard').nth(0)).toBeVisible();
    }
}
