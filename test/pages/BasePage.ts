import { expect, Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {
        this.page = page;
    }

    async waitForTimeout(timeout: number) {
        await this.page.waitForTimeout(timeout);
    }

    async login() {
        await this.page.goto('/login');
        await expect(this.page.locator('input[name="email"]')).toBeVisible();
        await this.page.fill('input[name="email"]', 'ccata002@gmail.com');

        await expect(this.page.locator('input[name="password"]')).toBeVisible();
        await this.page.fill('input[name="password"]', 'Password1234!');

        await expect(this.page.locator('button[type="submit"]')).toBeVisible();
        await this.page.click('button[type="submit"]');
    }

    // Common navigation methods
    async navigateToHome() {
        await this.page.click('text=Home');
    }

    async navigateToOrders() {
        await expect(this.page.locator('text=Orders')).toBeVisible();
        await this.page.click('text=Orders');
    }

    async navigateToManager() {
        await expect(this.page.locator('text=Manager')).toBeVisible();
        await this.page.click('text=Manager');
    }

    // Common page methods (like waiting for elements)
    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }
}
