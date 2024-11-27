import { Page, expect } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Common navigation methods

    protected async navigateToHref(href: string) {
        await this.page.waitForTimeout(500);
        const link = this.page.locator(`a[href="${href}"]`);
        await expect(link).toBeVisible();
        await link.click();
        await this.page.waitForTimeout(1500);
    }

    async navigateToHome() {
        await this.navigateToHref('/');
    }

    async navigateToOrders() {
        await this.navigateToHref('/orders');
    }

    async login() {
        await this.page.goto('/login');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.page.locator('input[name="email"]').fill('ccata002@gmail.com');
        await this.page.locator('input[name="password"]').fill('Password1234!');
        await this.page.locator('button[type="submit"]').click();
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async takeScreenshot(filename: string): Promise<void> {
        await this.page.screenshot({ path: filename });
    }
}
