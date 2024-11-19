import { expect, Page } from '@playwright/test';

export class CloseDrawerProcess {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async setHours(hours: number) {
        await this.page.locator(`//label[text()='Hours']/following::input[1]`).fill(hours.toString());
    }

    async clickSaveAndCloseDrawer() {
        await this.page.locator(`//button[text()='Save & Close Drawer']`).click();
    }

    async waitForDialog() {
        await this.page.locator('.MuiTypography-root:has-text("Confirm Drawer Close")').waitFor();
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    async createClosingPayment() {
        await this.page.locator('text=Create Closing Payment').click();
        await this.page.locator('button:has([data-testid="SaveIcon"])').click();
    }

    async clickConfirmDrawerClosure() {
        await this.page.locator('text=Confirm Drawer Closure').click();
    }

    async assertDrawerClosed() {
        await expect(this.page.locator('text=Reopen Drawer')).toBeVisible();
    }

    async completeCloseDriver(hours: number) {
        await this.setHours(hours);
        await this.clickSaveAndCloseDrawer();
        await this.waitForDialog();

        const buttonCreateClosing = await this.page.$('text=Create Closing Payment');

        if (buttonCreateClosing) {
            await this.createClosingPayment();
        }

        await this.clickConfirmDrawerClosure();
        await this.assertDrawerClosed();
    }

    async completeCloseRegister() {
        await this.clickSaveAndCloseDrawer();
        await this.waitForDialog();
        await this.clickConfirmDrawerClosure();
        await this.assertDrawerClosed();
    }

    async completeCloseThirdParty() {
        // await this.clickSaveAndCloseDrawer();
        // await this.waitForDialog();
        // await this.clickConfirmDrawerClosure();
        // await this.assertDrawerClosed();
    }
}
