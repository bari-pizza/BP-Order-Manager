import { Page, expect } from '@playwright/test';
import { Logger } from '../../utils/Logger';

export abstract class BasePage {
    protected page: Page;
    protected logger: Logger;

    constructor(page: Page) {
        this.page = page;
        this.logger = new Logger();
        this.wrapMethodsWithErrorHandling();
    }

    logInfo(message: string, details?: object) {
        this.logger.logInfo(message, details);
    }

    logError(error: Error, context?: string) {
        this.logger.logError(`Error in ${context}: ${error.message}`, { stack: error.stack });
    }

    // Method to wrap all class methods with error handling
    private wrapMethodsWithErrorHandling() {
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((methodName) => methodName !== 'constructor' && typeof (this as any)[methodName] === 'function');

        for (const methodName of methodNames) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const originalMethod = (this as any)[methodName];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any)[methodName] = async (...args: any[]) => {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    this.logError(error, methodName);
                    throw error; // Rethrow the error
                }
            };
        }
    }

    // Common navigation methods

    protected async navigateToHref(href: string) {
        const link = this.page.locator(`a[href="${href}"]`);
        await expect(link).toBeVisible();
        await link.click();
        await expect(this.page).toHaveURL(href);
        await this.page.mouse.move(0, 0);
        this.logger.logInfo(`Navigated to ${href}`);
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
        // const loginButton = this.page.locator('button[text="Login"]');
        // button that has text Sign In
        const loginButton = this.page.locator('button:has-text("Sign In")');

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(loginButton).toBeVisible();

        await emailInput.fill('ccata002@gmail.com');
        await passwordInput.fill('12345678');
        await loginButton.click();
        this.logger.logInfo('Logged in');
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async takeScreenshot(filename: string): Promise<void> {
        await this.page.screenshot({ path: filename });
    }
}
