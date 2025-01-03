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

    openLogger() {
        this.logger.openLogFile();
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
                    this.openLogger();
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
        this.logger.logInfo(`Navigated to ${href}`);
        await this.page.mouse.move(0, 0);
    }

    async navigateToHome() {
        await this.navigateToHref('/');
    }

    async navigateToOrders() {
        await this.navigateToHref('/orders');
        // make sure page has loaded
        await expect(this.page.locator('_react=OrderDashboard').nth(0)).toBeVisible();
    }

    protected async loginWithCredentials(isMobile: boolean) {
        await this.page.goto('/login');

        const emailInput = this.page.locator('input[name="email"]');
        const passwordInput = this.page.locator('input[name="password"]');
        // const loginButton = this.page.locator('button[text="Login"]');
        // button that has text Sign In
        const loginButton = this.page.locator('button:has-text("Sign In")');

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(loginButton).toBeVisible();

        const email = isMobile ? 'ccata002@gmail.com' : 'jrajulialmeida@gmail.com';
        const pw = '12345678';

        await emailInput.fill(email);
        await passwordInput.fill(pw);
        await loginButton.click();
        this.logger.logInfo('Logged in');
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async takeScreenshot(filename: string): Promise<void> {
        await this.page.screenshot({ path: filename });
    }

    async startTimeout(seconds: number, message = 'Time remaining:') {
        // Inject a timer element into the DOM
        await this.page.evaluate(() => {
            const timerDiv = document.createElement('div');
            timerDiv.id = 'playwright-timer';
            timerDiv.style.position = 'fixed';
            timerDiv.style.top = '10px';
            timerDiv.style.right = '10px';
            timerDiv.style.backgroundColor = '#000';
            timerDiv.style.color = '#fff';
            timerDiv.style.padding = '10px';
            timerDiv.style.borderRadius = '5px';
            timerDiv.style.fontSize = '16px';
            timerDiv.style.zIndex = '10000';
            document.body.appendChild(timerDiv);
        });

        // Countdown logic with optional message
        for (let i = seconds; i > 0; i -= 0.1) {
            await this.page.evaluate(
                (args: { timeLeft: number; msg: string }) => {
                    const timerDiv = document.getElementById('playwright-timer');
                    if (timerDiv) {
                        timerDiv.textContent = `${args.msg ? args.msg + ' ' : ''} ${args.timeLeft.toFixed(1)}s`;
                    }
                },
                { timeLeft: i, msg: message },
            );

            // Wait for 1 second
            await this.page.waitForTimeout(100);
        }

        // Cleanup the timer element after timeout
        await this.page.evaluate(() => {
            const timerDiv = document.getElementById('playwright-timer');
            if (timerDiv) {
                timerDiv.remove();
            }
        });
    }
}
