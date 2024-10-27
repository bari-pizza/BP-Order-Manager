import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

type DrawerIdentifier = string | number;

type DriverIdentifier = string | number | null;

export class ManagerPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToTab(tabName: string) {
        // check if tab is already selected
        const tab = this.page.locator(`text=${tabName}`);
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
    async clickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        const originallyOpen = (await drawerLocator.getAttribute('class'))?.includes('open-drawer');
        await drawerLocator.click();

        if (originallyOpen) {
            await expect(drawerLocator).not.toHaveClass(/open-drawer/);
        } else {
            await expect(drawerLocator).toHaveClass(/open-drawer/);
        }
    }

    async rightClickDrawer(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await drawerLocator.click({ button: 'right' });
    }

    async addDriver(driver?: DriverIdentifier) {
        const originalCount = await this.page.locator('.MuiButton-outlined.drawer-card-button').count();
        const addDriverButton = this.page
            .locator(`xpath=//*[contains(text(), 'Add Driver')]/ancestor::button[1]`)
            .nth(0);

        await addDriverButton.click();

        // Wait for the driver selection to be available (adjust the selector as necessary)
        const driverList = this.page.locator(`//label[text()='Driver']/following::input[1]`);
        await driverList.waitFor(); // Wait for the driver list to load

        // Selecting driver based on the type of input
        if (!driver) {
            // Choose a random driver if null
            await driverList.click();
            const allDrivers = await this.page.locator('.MuiAutocomplete-popper li').count(); // Assuming each driver is listed in a <li> element
            const randomIndex = Math.ceil(Math.random() * allDrivers);
            console.log('Random index:', randomIndex, 'All drivers:', allDrivers);
            for (let i = 0; i < randomIndex; i++) {
                await driverList.press('ArrowDown');
            }
            await driverList.press('Enter');
        } else if (typeof driver === 'string') {
            // Select driver by name
            await driverList.fill(driver);
            await driverList.press('ArrowDown');
            await driverList.press('Enter');
        } else if (typeof driver === 'number') {
            // Select driver by index
            await driverList.click();
            for (let i = 0; i < driver; i++) {
                await driverList.press('ArrowDown');
            }
            await driverList.press('Enter');
        } else {
            throw new Error('Invalid driver identifier. Must be string, number, or null.');
        }
        const submitButton = this.page.locator(
            `//div[contains(@class, 'MuiDialog-root')]//button[contains(text(), 'Add Driver')]`,
        );
        await submitButton.click();
        await expect(submitButton).not.toBeVisible();

        const newCount = await this.page.locator('.MuiButton-outlined.drawer-card-button').count();
        expect(newCount).toBe(originalCount + 1);
    }

    async assertDrawerOpen(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await expect(drawerLocator).toHaveClass(/open-drawer/);
        this.assertSidebarOpen();
    }

    async assertDrawerClosed(drawerLocator: Locator | null) {
        if (!drawerLocator) {
            throw new Error('Drawer locator is null');
        }
        await expect(drawerLocator).not.toHaveClass(/open-drawer/);
        this.assertSidebarClosed();
    }

    async assertSidebarOpen() {
        await expect(this.page.locator('#sidebar-drawer .drawer-card-button')).toBeVisible();
    }

    async assertSidebarClosed() {
        await expect(this.page.locator('#sidebar-drawer .drawer-card-button')).not.toBeVisible();
    }

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Asserts that a driver with the given name is visible on the page
     * @param driverName The name of the driver to look for
     */
    /******  d96a7823-117a-4dff-863b-da464f22efc2  *******/
    async assertDriverIsAdded(driverName: string) {
        await expect(this.page.locator(`text=${driverName}`)).toBeVisible();
    }
}
