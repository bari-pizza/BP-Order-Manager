import { expect, type Page } from '@playwright/test';

const toastError = (page: Page) => page.locator('.Toastify__toast--error');

export const loginAs = async (page: Page, email: string, password: string) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).click();
    await page.getByLabel('Password', { exact: true }).fill(password);

    const signIn = page.getByRole('button', { name: 'Sign In' });
    await expect(signIn).toBeEnabled({ timeout: 10_000 });
    await signIn.click();

    const errorToast = toastError(page);
    await Promise.race([
        page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 }),
        errorToast.waitFor({ state: 'visible', timeout: 15_000 }),
    ]).catch(() => undefined);

    if (await errorToast.isVisible()) {
        throw new Error(`Login failed for ${email}: ${await errorToast.innerText()}`);
    }

    await expect(page).not.toHaveURL(/\/login/);
};
