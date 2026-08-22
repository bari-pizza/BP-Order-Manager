import { expect, type Page } from '@playwright/test';

const toastError = (page: Page) => page.locator('.Toastify__toast--error');

export class CloseDrawerProcess {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickSaveAndCloseDrawer() {
        await this.page.getByRole('button', { name: 'Save & Close Drawer' }).click();
    }

    async waitForDialog() {
        await expect(this.page.getByRole('heading', { name: 'Confirm Drawer Close' })).toBeVisible({ timeout: 10_000 });
    }

    async createClosingPayment() {
        await this.page.getByRole('button', { name: /Closing Payment/ }).click();
        const saveTransfer = this.page.locator('button:has([data-testid="SaveIcon"])');
        await expect(saveTransfer).toBeVisible({ timeout: 10_000 });

        const drawerInput = this.page.getByRole('dialog').getByLabel('Drawer');
        if (await drawerInput.isVisible().catch(() => false)) {
            const currentValue = (await drawerInput.inputValue().catch(() => '')).trim();
            if (!currentValue) {
                await drawerInput.click();
                const listbox = this.page.getByRole('listbox');
                await expect(listbox).toBeVisible({ timeout: 10_000 });
                await listbox.getByRole('option').first().click();
            }
        }

        await saveTransfer.click();
        await Promise.race([
            this.page.getByRole('button', { name: 'Confirm Drawer Closure' }).waitFor({ state: 'visible', timeout: 10_000 }),
            toastError(this.page).waitFor({ state: 'visible', timeout: 10_000 }),
        ]).catch(() => undefined);
        if (await toastError(this.page).isVisible()) {
            throw new Error(`Closing payment failed: ${await toastError(this.page).innerText()}`);
        }
    }

    async clickConfirmDrawerClosure() {
        const confirm = this.page.getByRole('button', { name: 'Confirm Drawer Closure' });
        if (!(await confirm.isVisible())) {
            throw new Error(
                `Confirm Drawer Closure never appeared. Dialog: ${await this.page.getByRole('dialog').innerText()}`,
            );
        }
        await confirm.click();
    }

    async assertDrawerClosed() {
        await Promise.race([
            this.page.getByRole('button', { name: 'Reopen Drawer' }).waitFor({ state: 'visible', timeout: 15_000 }),
            toastError(this.page).waitFor({ state: 'visible', timeout: 15_000 }),
        ]).catch(() => undefined);

        if (await toastError(this.page).isVisible()) {
            throw new Error(`Close drawer failed: ${await toastError(this.page).innerText()}`);
        }

        await expect(this.page.getByRole('button', { name: 'Reopen Drawer' })).toBeVisible({ timeout: 5_000 });
    }

    async completeCloseDriver(hours = 2) {
        const hoursField = this.page.getByLabel('Hours');
        if (await hoursField.isVisible().catch(() => false)) {
            await hoursField.fill(String(hours));
        }

        await this.clickSaveAndCloseDrawer();
        await this.waitForDialog();

        const buttonClosingPayment = this.page.getByRole('button', { name: /Closing Payment/ });
        if (await buttonClosingPayment.isVisible()) {
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
        await this.clickSaveAndCloseDrawer();
        await this.waitForDialog();
        await this.clickConfirmDrawerClosure();
        await this.assertDrawerClosed();
    }
}
