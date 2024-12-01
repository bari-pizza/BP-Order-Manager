import { Page, expect } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Common navigation methods

    protected async navigateToHref(href: string) {
        const link = this.page.locator(`a[href="${href}"]`);
        await expect(link).toBeVisible();
        await link.click();
    }

    async navigateToHome() {
        await this.navigateToHref('/');
    }

    async navigateToOrders() {
        await this.navigateToHref('/orders');
        // make sure page has loaded
        await expect(this.page.locator('_react=OrderDashboard').nth(0)).toBeVisible();
    }

    async login() {
        await this.page.goto('/login');

        const emailInput = this.page.locator('input[name="email"]');
        const passwordInput = this.page.locator('input[name="password"]');
        const loginButton = this.page.locator('button[type="submit"]');

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(loginButton).toBeVisible();

        await emailInput.fill('ccata002@gmail.com');
        await passwordInput.fill('Password1234!');
        await loginButton.click();
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async takeScreenshot(filename: string): Promise<void> {
        await this.page.screenshot({ path: filename });
    }
}
