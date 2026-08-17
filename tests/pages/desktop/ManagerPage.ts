import { expect, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test';
import { BasePageDesktop } from '../BasePage/BasePageDesktop';
import { CloseDrawerProcess } from '../../utils/CloseDrawerProcess';
import { BasePage } from '../BasePage/BasePage';
import { TEST_ACCOUNTS } from '../../utils/testAccounts';

type DrawerIdentifier = string | number;

type DriverIdentifier = string | number | null;

export class ManagerPage extends BasePageDesktop {
    private closeBusinessDayCard: Locator = this.page.locator('//button[text()="Close Business Day"]');
    private closeBusinessDayPopup: Locator = this.page.locator('.MuiDialog-root:has-text("Close Business Day")');
    private closeBusinessDayButton: Locator = this.closeBusinessDayPopup.locator('//button[text()="Close Day"]');
    private closeDrawerProcess: CloseDrawerProcess;
    constructor(page: Page, context: BrowserContext, browser: Browser) {
        super(page, context, browser);
        this.closeDrawerProcess = new CloseDrawerProcess(page);
    }

    async navigateToTab(tabName: string) {
        // check if tab is already selected
        const tab = this.page.locator(`.MuiTab-root >> text=${tabName}`);
        await expect(tab).toBeVisible();
        if ((await tab.getAttribute('class'))?.includes('Mui-selected')) {
            return;
        }
        await tab.click();

        await expect(tab).toHaveClass(/Mui-selected/);
    }

    // Get drawer by name or index (starting from 1)
    async getDrawer(identifier: DrawerIdentifier) {
        let drawerLocator: Locator | null = null;

        if (typeof identifier === 'string') {
            // If identifier is 'selected', return the locator for the selected drawer
            if (identifier === 'selected') {
                drawerLocator = this.page.locator(`.drawer-card-button.open-drawer`).nth(0);
            } else {
                // If identifier is a name, return the locator for the drawer by name
                drawerLocator = this.page
                    .locator(`xpath=//*[contains(text(), '${identifier}')]/ancestor::button[1]`)
                    .nth(0);
            }
        } else if (typeof identifier === 'number') {
            // If identifier is an index, return the locator for the drawer by index
            drawerLocator = this.page.locator(`//button[contains(@class, "drawer-card-button")]`).nth(identifier - 1);
        }

        return drawerLocator;
    }

    // Interact with a drawer by passing the drawer locator
    async clickDrawer(drawerLocator: Locator) {
        await drawerLocator.click();
        await this.page.waitForTimeout(500);
    }

    async rightClickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await drawerLocator.click({ button: 'right' });
    }

    async addDriver(driver?: DriverIdentifier) {
        const addDriverButton = this.page
            .locator(`xpath=//*[contains(text(), 'Add Driver')]/ancestor::button[1]`)
            .nth(0);

        await addDriverButton.click();

        // Wait for the driver selection to be available (adjust the selector as necessary)
        const driverList = this.page.locator(`//label[text()='Driver']/following::input[1]`);
        await driverList.waitFor(); // Wait for the driver list to load

        let driverName: string | null = null;

        // Selecting driver based on the type of input
        if (!driver) {
            // Choose a random driver if null
            await driverList.click();
            const allDrivers = await this.page.locator('.MuiAutocomplete-popper li').count(); // Assuming each driver is listed in a <li> element
            const randomIndex = Math.ceil(Math.random() * allDrivers);
            for (let i = 0; i < randomIndex; i++) {
                await driverList.press('ArrowDown');
            }
            driverName = await driverList.inputValue();
            await driverList.press('Enter');
        } else if (typeof driver === 'string') {
            // Select driver by name
            // TODO: improve this logic
            driverName = driver;
            await driverList.fill(driver);
            await new Promise((resolve) => setTimeout(resolve, 500));
            await driverList.press('ArrowDown');
            await driverList.press('Enter');
        } else if (typeof driver === 'number') {
            // Select driver by index
            await driverList.click();
            for (let i = 0; i < driver; i++) {
                await driverList.press('ArrowDown');
            }
            driverName = await driverList.inputValue();
            await driverList.press('Enter');
        } else {
            throw new Error('Invalid driver identifier. Must be string, number, or null.');
        }
        const submitButton = this.page.locator(
            `//div[contains(@class, 'MuiDialog-root')]//button[contains(text(), 'Add Driver')]`,
        );
        await new Promise((resolve) => setTimeout(resolve, 200));
        await submitButton.click();
        await expect(submitButton).not.toBeVisible();

        // const newCount = await this.page.locator('.MuiButton-outlined.drawer-card-button').count();
        // expect(newCount).toBe(originalCount + 1);
        const drawerLocator = await this.getDrawer(driverName!);
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }

        const driverEmail =
            (await drawerLocator.getAttribute('data-user-email')) ||
            TEST_ACCOUNTS.find((account) => `${account.first_name} ${account.last_name}` === driverName)?.email;
        if (!driverEmail || !driverName) {
            throw new Error(`Added driver ${driverName} but could not read their email`);
        }
        this.logInfo(`Added driver ${driverName} with email ${driverEmail}`);
        BasePage.todaysDrivers.push({ email: driverEmail, name: driverName });
    }

    async closeDriver(drawerLocator: Locator) {
        await this.clickDrawer(drawerLocator);
        const reopen = this.page.getByRole('button', { name: 'Reopen Drawer' });
        if (await reopen.isVisible()) {
            return;
        }
        await this.closeDrawerProcess.completeCloseDriver();
        this.logInfo(`Closed driver ${await drawerLocator.allTextContents()}`);
    }

    async closeDrivers() {
        const drivers = this.page.locator('#simple-tabpanel-drawers .drawer-card-button-driver');
        const count = await drivers.count();
        for (let i = 0; i < count; i += 1) {
            console.log('closing driver:', await drivers.nth(i).allInnerTexts());
            await this.closeDriver(drivers.nth(i));
        }
    }

    async closeOtherDrawers() {
        const registers = this.page.locator('#simple-tabpanel-drawers .drawer-card-button-register');
        const registerCount = await registers.count();
        for (let i = 0; i < registerCount; i += 1) {
            await this.clickDrawer(registers.nth(i));
            const reopen = this.page.getByRole('button', { name: 'Reopen Drawer' });
            if (await reopen.isVisible()) {
                continue;
            }
            await this.closeDrawerProcess.completeCloseRegister();
            this.logInfo(`Closed drawer ${await registers.nth(i).allInnerTexts()}`);
        }
        const thirdPartyDrawers = this.page.locator('#simple-tabpanel-drawers .drawer-card-button-third_party');
        const thirdPartyCount = await thirdPartyDrawers.count();
        for (let i = 0; i < thirdPartyCount; i += 1) {
            await this.clickDrawer(thirdPartyDrawers.nth(i));
            const reopen = this.page.getByRole('button', { name: 'Reopen Drawer' });
            if (await reopen.isVisible()) {
                continue;
            }
            await this.closeDrawerProcess.completeCloseThirdParty();
            this.logInfo(`Closed drawer ${await thirdPartyDrawers.nth(i).allInnerTexts()}`);
        }
    }

    async closeDrawers() {
        await this.closeDrivers();
        await this.closeOtherDrawers();
    }

    async openCloseDayPopup() {
        await this.closeBusinessDayCard.click();
        await this.closeBusinessDayPopup.isVisible();
    }

    async closeBusinessDay() {
        await this.openCloseDayPopup();
        const closeDay = this.closeBusinessDayButton;
        if (await closeDay.isDisabled()) {
            throw new Error(`Cannot close day yet: ${await this.closeBusinessDayPopup.innerText()}`);
        }
        await closeDay.click();
        await expect(this.page.getByRole('button', { name: 'Show Business Day Summary' })).toBeVisible({
            timeout: 15_000,
        });
        this.logInfo('Closed business day');
    }

    async addDriversToDay(driverNames: string[]) {
        this.logInfo('Adding drivers');
        await this.navigateToManager();
        await this.navigateToTab('Drawers');
        for (const driverName of driverNames) {
            await this.addDriver(driverName);
        }
    }

    async closeAllDrawers() {
        this.logInfo('Closing all drawers');
        await this.navigateToManager();
        await this.navigateToTab('Drawers');
        await this.closeDrawers();
    }

    async closeDay() {
        this.logInfo('Closing business day');
        await this.navigateToManager();
        await this.navigateToTab('Drawers');
        await this.closeBusinessDay();
    }
}
