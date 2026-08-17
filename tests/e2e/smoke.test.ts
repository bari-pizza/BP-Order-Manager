import { expect, test, devices, type Locator, type Page } from '@playwright/test';
import { getSeededDriverNames, seedBusinessDate, wipeBusinessDate } from '../utils/seed';
import { loginAs } from '../utils/login';
import { getManagerCredentials, getTestPassword, TEST_ACCOUNTS } from '../utils/testAccounts';

const toastError = (page: Page) => page.locator('.Toastify__toast--error');

const loginAsAdmin = async (page: Page) => {
    const { email, password } = getManagerCredentials();
    await loginAs(page, email, password);
};

const firstSeededDriverName = () => getSeededDriverNames()[0];

const openOrdersEditor = async (page: Page) => {
    await loginAsAdmin(page);
    await page.goto('/orders');
    await expect(page.locator('#add-order-button')).toBeVisible({ timeout: 15_000 });
    await page.locator('#add-order-button').click();
    await expect(page.locator('.order-editor')).toBeVisible();
};

const saveOrderAndExpectTicket = async (page: Page, ticketText: string) => {
    const editor = page.locator('.order-editor');
    await page.getByRole('button', { name: 'Save' }).click();

    const ticket = page.locator('.order-ticket').filter({ hasText: ticketText });
    const rootError = editor.locator('.MuiTypography-root').filter({ hasText: /Couldn|Required|Must/ });
    await Promise.race([
        ticket.waitFor({ state: 'visible', timeout: 15_000 }),
        rootError.first().waitFor({ state: 'visible', timeout: 15_000 }),
        page.locator('.MuiFormHelperText-root.Mui-error').first().waitFor({ state: 'visible', timeout: 15_000 }),
    ]).catch(() => undefined);

    if (!(await ticket.isVisible())) {
        const helper = await page.locator('.MuiFormHelperText-root').allInnerTexts();
        const extra = await rootError.allInnerTexts();
        throw new Error(`Order did not save. Field errors: ${JSON.stringify(helper)} Root: ${JSON.stringify(extra)}`);
    }

    return ticket;
};

const assignUnassignedTicketsTo = async (page: Page, drawer: Locator, ticketText: string) => {
    const ticket = page.locator('.order-ticket').filter({ hasText: ticketText });
    await expect(ticket).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Select All Tickets' }).click();
    await expect(page.getByRole('button', { name: 'Unselect All Tickets' })).toBeVisible();

    if ((await drawer.count()) === 0) {
        const drawerLabels = await page.locator('.drawer-card-button').allInnerTexts();
        throw new Error(`Target drawer not on /orders. Drawers: ${JSON.stringify(drawerLabels)}`);
    }
    await drawer.click();

    const errorToast = toastError(page);
    await Promise.race([
        ticket.waitFor({ state: 'hidden', timeout: 15_000 }),
        errorToast.waitFor({ state: 'visible', timeout: 15_000 }),
    ]).catch(() => undefined);

    if (await errorToast.isVisible()) {
        throw new Error(`Assign order failed: ${await errorToast.innerText()}`);
    }

    await expect(ticket).toBeHidden({ timeout: 5_000 });
    await drawer.click();
    await expect(page.locator('.order-ticket').filter({ hasText: ticketText })).toBeVisible({ timeout: 10_000 });
};

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
    await seedBusinessDate();
});

test.afterAll(async () => {
    await wipeBusinessDate();
});

test('admin can sign in', async ({ page }) => {
    const { email, password } = getManagerCredentials();
    await loginAs(page, email, password);
    await page.goto('/orders');
    await expect(page.locator('#add-order-button')).toBeVisible({ timeout: 15_000 });
});

test('driver can sign in', async ({ page }) => {
    const driver = TEST_ACCOUNTS.find((account) => account.is_driver);
    if (!driver) {
        throw new Error('No seeded driver account');
    }
    await loginAs(page, driver.email, getTestPassword());
    await page.goto('/orders');
    await expect(page).not.toHaveURL(/\/login/);
});

test('admin can create one Bari Pizza pickup order', async ({ page }) => {
    await openOrdersEditor(page);

    await page.getByRole('combobox', { name: 'Order Type' }).click();
    await page.getByRole('option', { name: 'Pickup' }).click();

    await page.getByLabel('Order Number').fill('1');
    await page.getByLabel('Total').fill('15.00');
    await page.getByRole('button', { name: 'Cash' }).click();

    await saveOrderAndExpectTicket(page, 'Order #1');
    await expect(page.locator('.order-editor')).toBeVisible();
    await expect(page.getByLabel('Order Number')).toHaveValue('2');
});

test('admin can add a driver to the day', async ({ page }) => {
    const driverName = firstSeededDriverName();
    await loginAsAdmin(page);
    await page.goto('/manager');
    await expect(page.locator('.manager-dashboard')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('tab', { name: 'Drawers' }).click();

    await page.locator('.drawer-card-button-add-driver').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Choose Driver' })).toBeVisible();

    await dialog.getByLabel('Driver').click();
    await page.getByRole('option', { name: driverName }).click();
    if (await dialog.getByLabel('Bank').isVisible()) {
        await dialog.getByLabel('Bank').fill('0.00');
    }
    await dialog.getByRole('button', { name: 'Add Driver' }).click();

    if (await toastError(page).isVisible()) {
        throw new Error(`Add driver failed: ${await toastError(page).innerText()}`);
    }

    await expect(dialog).toBeHidden({ timeout: 10_000 });
    await expect(page.locator('.drawer-card-button-driver').filter({ hasText: driverName })).toBeVisible({
        timeout: 10_000,
    });
});

test('admin can assign an unassigned pickup order to Register', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/orders');
    await expect(page.locator('#add-order-button')).toBeVisible({ timeout: 15_000 });
    await assignUnassignedTicketsTo(page, page.locator('.drawer-card-button-register').first(), 'Order #1');
});

test('admin can create a third-party pickup and assign it to Third Party', async ({ page }) => {
    await openOrdersEditor(page);

    await page.getByRole('combobox', { name: 'Origin' }).click();
    const originOptions = (await page.getByRole('option').allInnerTexts()).map((name) => name.trim()).filter(Boolean);
    await page.keyboard.press('Escape');

    let selectedOrigin = '';
    for (const name of originOptions) {
        await page.getByRole('combobox', { name: 'Origin' }).click();
        await page.getByRole('option', { name, exact: true }).click();
        if (await page.locator('.payment-type-third_party').isVisible()) {
            selectedOrigin = name;
            break;
        }
    }
    if (!selectedOrigin) {
        throw new Error(
            `No origin showed a 3rd Party payment button. Origins: ${JSON.stringify(originOptions)}. Set is_third_party on DoorDash (or re-run migration_order_origin_flags.sql).`,
        );
    }

    if (await page.getByRole('combobox', { name: 'Order Type' }).isEnabled()) {
        await page.getByRole('combobox', { name: 'Order Type' }).click();
        await page.getByRole('option', { name: 'Pickup' }).click();
    }

    const orderName = page.getByLabel('Order Name');
    if (await orderName.isVisible()) {
        await orderName.fill('SmokeTP');
    } else {
        await page.getByLabel('Order Number').fill('3');
    }
    await page.getByLabel('Total').fill('20.00');

    const thirdPartyPay = page.locator('.payment-type-third_party');
    if ((await thirdPartyPay.count()) === 0) {
        const payLabels = await page.locator('[class*="payment-type-"]').allInnerTexts();
        throw new Error(
            `${selectedOrigin} has no 3rd Party payment button. Buttons: ${JSON.stringify(payLabels)}`,
        );
    }
    await thirdPartyPay.click();
    const ticketText = (await orderName.isVisible()) ? 'SmokeTP' : 'Order #3';
    await saveOrderAndExpectTicket(page, ticketText);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('#add-order-button')).toBeVisible();

    await assignUnassignedTicketsTo(page, page.locator('.drawer-card-button-third_party').first(), ticketText);
});

test('admin can create a delivery and assign it to a driver', async ({ page }) => {
    const driverName = firstSeededDriverName();
    await openOrdersEditor(page);

    await page.getByRole('combobox', { name: 'Order Type' }).click();
    await page.getByRole('option', { name: 'Delivery' }).click();

    await page.getByLabel('Order Number').fill('2');
    await page.getByLabel('Total').fill('25.00');
    await page.getByRole('button', { name: 'Cash' }).click();
    await saveOrderAndExpectTicket(page, 'Order #2');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('#add-order-button')).toBeVisible();

    const driverCard = page.locator('.drawer-card-button-driver').filter({ hasText: driverName });
    await assignUnassignedTicketsTo(page, driverCard, 'Order #2');
});

const goToManagerDrawers = async (page: Page) => {
    await loginAsAdmin(page);
    await page.goto('/manager');
    await expect(page.locator('.manager-dashboard')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('tab', { name: 'Drawers' }).click();
};

const closeOpenManagerDrawer = async (page: Page, drawer: Locator) => {
    await drawer.click();
    const reopen = page.getByRole('button', { name: 'Reopen Drawer' });
    const saveAndClose = page.getByRole('button', { name: 'Save & Close Drawer' });
    await Promise.race([
        reopen.waitFor({ state: 'visible', timeout: 8_000 }),
        saveAndClose.waitFor({ state: 'visible', timeout: 8_000 }),
    ]).catch(() => undefined);

    if (await reopen.isVisible()) {
        return;
    }
    if (!(await saveAndClose.isVisible())) {
        throw new Error('Neither Save & Close Drawer nor Reopen Drawer appeared after selecting a drawer');
    }

    // Leave driver hours at 0. Filling hours after the dialog opens (or without
    // updating hours_in_cents) makes the closing-payment amount miss the
    // outstanding balance, so Confirm Drawer Closure never appears.
    await saveAndClose.click();
    await expect(page.getByRole('heading', { name: 'Confirm Drawer Close' })).toBeVisible({ timeout: 10_000 });

    const createClosingPayment = page.getByRole('button', { name: /Closing Payment/ });
    if (await createClosingPayment.isVisible()) {
        await createClosingPayment.click();
        const saveTransfer = page.locator('button:has([data-testid="SaveIcon"])');
        await expect(saveTransfer).toBeVisible({ timeout: 10_000 });
        const otherDrawer = page.getByRole('dialog').getByLabel('Drawer');
        if (await otherDrawer.isVisible()) {
            await otherDrawer.click();
            const registerOption = page.getByRole('option').first();
            await expect(registerOption).toBeVisible();
            await registerOption.click();
        }
        await saveTransfer.click();
        await Promise.race([
            page.getByRole('button', { name: 'Confirm Drawer Closure' }).waitFor({ state: 'visible', timeout: 10_000 }),
            toastError(page).waitFor({ state: 'visible', timeout: 10_000 }),
        ]).catch(() => undefined);
        if (await toastError(page).isVisible()) {
            throw new Error(`Closing payment failed: ${await toastError(page).innerText()}`);
        }
    }

    const confirm = page.getByRole('button', { name: 'Confirm Drawer Closure' });
    if (!(await confirm.isVisible())) {
        throw new Error(`Confirm Drawer Closure never appeared. Dialog: ${await page.getByRole('dialog').innerText()}`);
    }
    await confirm.click();

    await Promise.race([
        page.getByRole('button', { name: 'Reopen Drawer' }).waitFor({ state: 'visible', timeout: 15_000 }),
        toastError(page).waitFor({ state: 'visible', timeout: 15_000 }),
    ]).catch(() => undefined);

    if (await toastError(page).isVisible()) {
        const message = await toastError(page).innerText();
        if (/lock_drawer|Could not find the function/i.test(message)) {
            throw new Error(
                `Close drawer failed because lock_drawer is missing on the database. Run supabase-functions/lock-drawer.sql. Original: ${message}`,
            );
        }
        throw new Error(`Close drawer failed: ${message}`);
    }

    await expect(page.getByRole('button', { name: 'Reopen Drawer' })).toBeVisible({ timeout: 5_000 });
};

test('driver on a phone can see their order and add a tip', async ({ browser }) => {
    const driverName = firstSeededDriverName();
    const driver = TEST_ACCOUNTS.find((account) => `${account.first_name} ${account.last_name}` === driverName);
    if (!driver) {
        throw new Error(`No seeded account for ${driverName}`);
    }

    const context = await browser.newContext({
        ...devices['iPhone 12'],
        baseURL: test.info().project.use.baseURL,
    });
    const page = await context.newPage();

    await loginAs(page, driver.email, getTestPassword());
    await page.goto('/orders');
    await expect(page.getByText('Ask manager to assign you to work today')).toBeHidden();

    const ticket = page.locator('.order-ticket').filter({ hasText: 'Order #2' });
    await expect(ticket).toBeVisible({ timeout: 15_000 });
    await ticket.locator('.order-total').click();

    const editor = page.locator('.order-editor');
    await expect(editor).toBeVisible();
    await editor.locator('.payment-editor-edit-payment').first().click();
    await editor.getByLabel('Tip').fill('2.00');
    await editor.getByRole('button', { name: 'Save' }).click();
    await expect(editor.locator('.payment-tip-in-cents')).toHaveText('$2.00', { timeout: 10_000 });

    await page.keyboard.press('Escape');
    await expect(ticket.locator('.order-tips')).toHaveText('$2.00', { timeout: 10_000 });
    await context.close();
});

const closeAllOpenManagerDrawers = async (page: Page, cards: Locator) => {
    const count = await cards.count();
    for (let i = 0; i < count; i += 1) {
        await closeOpenManagerDrawer(page, cards.nth(i));
    }
};

test('admin can close the driver, register, and third-party drawers', async ({ page }) => {
    await goToManagerDrawers(page);

    const panel = page.locator('#simple-tabpanel-drawers');
    await closeAllOpenManagerDrawers(page, panel.locator('.drawer-card-button-driver'));
    await closeAllOpenManagerDrawers(page, panel.locator('.drawer-card-button-register'));
    await closeAllOpenManagerDrawers(page, panel.locator('.drawer-card-button-third_party'));
});

test('admin can close the business day', async ({ page }) => {
    await goToManagerDrawers(page);
    await page.getByRole('button', { name: 'Close Business Day' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Close Business Day' })).toBeVisible();

    const closeDay = dialog.getByRole('button', { name: 'Close Day' });
    if (await closeDay.isDisabled()) {
        throw new Error(`Cannot close day yet: ${await dialog.innerText()}`);
    }
    await closeDay.click();

    if (await toastError(page).isVisible()) {
        throw new Error(`Close day failed: ${await toastError(page).innerText()}`);
    }

    await expect(page.getByRole('button', { name: 'Show Business Day Summary' })).toBeVisible({ timeout: 15_000 });
});
