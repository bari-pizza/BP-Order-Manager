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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.page.locator('input[name="email"]').fill('ccata002@gmail.com');
        await this.page.locator('input[name="password"]').fill('Password1234!');
        await this.page.locator('button[type="submit"]').click();
        // await expect(this.page.locator('input[name="email"]')).toBeVisible();
        // await this.page.fill('input[name="email"]', 'ccata002@gmail.com');

        // await expect(this.page.locator('input[name="password"]')).toBeVisible();
        // await this.page.fill('input[name="password"]', 'Password1234!');

        // await expect(this.page.locator('button[type="submit"]')).toBeVisible();
        // await this.page.click('button[type="submit"]');
    }

    // Common navigation methods
    async navigateToHome() {
        await expect(this.page.locator('.MuiDrawer-docked >> text=Home')).toBeVisible();
        await this.page.locator('.MuiDrawer-docked >> text=Home').click();
    }

    async navigateToOrders() {
        const ordersLink = this.page.locator('.MuiDrawer-docked >> text=Orders');
        await expect(ordersLink).toBeVisible();
        console.log({ ordersLink });
        await ordersLink.click();
    }

    async navigateToManager() {
        await expect(this.page.locator('.MuiDrawer-docked >> text=Manager')).toBeVisible();
        await this.page.locator('.MuiDrawer-docked >> text=Manager').click();
    }

    // Common page methods (like waiting for elements)
    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }
}
