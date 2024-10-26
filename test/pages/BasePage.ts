import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {
        this.page = page;
        page.goto('/');
    }

    async waitForTimeout(timeout: number) {
        await this.page.waitForTimeout(timeout);
    }

    async login() {
        await this.page.goto('/login');
        await this.page.fill('input[name="email"]', 'ccata002@gmail.com');
        await this.page.fill('input[name="password"]', 'Password1234!');
        await this.page.click('button[type="submit"]');
        await this.page.waitForTimeout(1000);
    }

    // Common navigation methods
    async navigateToHome() {
        await this.page.click('text=Home');
    }

    async navigateToOrders() {
        (await this.page.waitForSelector('text=Orders', { state: 'attached' })).click();
    }

    async navigateToManager() {
        await this.page.click('text=Manager');
    }

    // Common page methods (like waiting for elements)
    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }
}
