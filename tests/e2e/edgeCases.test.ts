import { expect, test, devices, type Page } from '@playwright/test';
import {
    getAnonRestConfig,
    insertUnassignedPickupOrder,
    lockAllTillDrawers,
    seedBusinessDate,
    setBusinessDayLocked,
    setProfileDeleted,
    wipeBusinessDate,
} from '../utils/seed';
import { loginAs } from '../utils/login';
import { getManagerCredentials, getTestPassword, TEST_ACCOUNTS } from '../utils/testAccounts';

const cashier = () => {
    const account = TEST_ACCOUNTS.find((a) => a.email.includes('cashier'));
    if (!account) {
        throw new Error('test.cashier account missing from TEST_ACCOUNTS');
    }
    return account;
};

const driverAccount = () => {
    const account = TEST_ACCOUNTS.find((a) => a.is_driver);
    if (!account) {
        throw new Error('No driver test account');
    }
    return account;
};

const loginAsAdmin = async (page: Page) => {
    const { email, password } = getManagerCredentials();
    await loginAs(page, email, password);
};

test.describe('BAR-5 edge cases', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async () => {
        await seedBusinessDate();
    });

    test.afterAll(async () => {
        let profileRestoreError: unknown;
        try {
            await setProfileDeleted(driverAccount().email, false);
        } catch (error) {
            profileRestoreError = error;
        }
        await setBusinessDayLocked(false).catch(() => undefined);
        await wipeBusinessDate();
        if (profileRestoreError) {
            throw profileRestoreError;
        }
    });

    test('login accepts mixed-case email', async ({ page }) => {
        const { email, password } = getManagerCredentials();
        const [local, domain] = email.split('@');
        const mixedEmail = `${local.toUpperCase()}@${domain}`;
        await loginAs(page, mixedEmail, password);
        await page.goto('/orders');
        await expect(page.locator('#add-order-button')).toBeVisible({ timeout: 15_000 });
    });

    test('cashier cannot open manager dashboard', async ({ page }) => {
        const account = cashier();
        await loginAs(page, account.email, getTestPassword());
        await page.goto('/manager');
        await expect(page.getByText('Access Denied')).toBeVisible({ timeout: 15_000 });
        await expect(page.locator('.manager-dashboard')).toHaveCount(0);
    });

    test('non-driver on mobile Orders sees drivers-only empty state', async ({ browser }) => {
        const account = cashier();
        const context = await browser.newContext({
            ...devices['iPhone 12'],
        });
        const page = await context.newPage();
        await loginAs(page, account.email, getTestPassword());
        await page.goto('/orders');
        await expect(page.getByText('This app is for drivers')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(/Use a desktop or tablet for Manager/i)).toBeVisible();
        await context.close();
    });

    test('soft-deleted employee loses access after reload', async ({ page }) => {
        const account = driverAccount();
        await loginAs(page, account.email, getTestPassword());
        await page.goto('/orders');
        await expect(page).not.toHaveURL(/\/login/);

        await setProfileDeleted(account.email, true);

        await page.reload();
        // Client signs out when profile.is_deleted; otherwise RLS blocks shop data → login/skeleton.
        await expect(page).toHaveURL(/\/login/, { timeout: 20_000 });

        await setProfileDeleted(account.email, false);
    });

    test('close day stays blocked while an unassigned order exists', async ({ page }) => {
        await setBusinessDayLocked(false);
        await lockAllTillDrawers();
        await insertUnassignedPickupOrder();

        await loginAsAdmin(page);
        await page.goto('/manager');
        await expect(page.locator('.manager-dashboard')).toBeVisible({ timeout: 15_000 });
        await page.getByRole('tab', { name: 'Drawers' }).click();

        await page.getByRole('button', { name: 'Close Business Day' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Close Business Day' })).toBeVisible();
        await expect(dialog.getByText(/cannot close the business day/i)).toBeVisible();
        await expect(dialog.getByText(/Unassigned Order/i)).toBeVisible();
        await expect(dialog.getByRole('button', { name: 'Close Day' })).toBeDisabled();
        await page.keyboard.press('Escape');
    });

    test('locked business day can be reopened from manager', async ({ page }) => {
        await wipeBusinessDate();
        await setBusinessDayLocked(true);

        await loginAsAdmin(page);
        await page.goto('/manager');
        await expect(page.locator('.manager-dashboard')).toBeVisible({ timeout: 15_000 });
        await page.getByRole('tab', { name: 'Drawers' }).click();

        await expect(page.getByRole('button', { name: 'Show Business Day Summary' })).toBeVisible({
            timeout: 15_000,
        });
        await page.getByRole('button', { name: 'Show Business Day Summary' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Business Day Summary' })).toBeVisible();
        await dialog.getByRole('button', { name: 'Reopen Day' }).click();

        await expect(page.getByRole('button', { name: 'Close Business Day' })).toBeVisible({ timeout: 15_000 });
    });

    test('anon key cannot patch Resource', async ({ request }) => {
        const { url, anon } = getAnonRestConfig();
        const response = await request.patch(`${url}/rest/v1/Resource?title=eq.Register`, {
            headers: {
                apikey: anon,
                Authorization: `Bearer ${anon}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
            },
            data: { src: '' },
        });
        expect(response.status(), await response.text()).toBe(403);
    });
});
