import { Browser, BrowserContext, chromium, devices, Page } from '@playwright/test';
import { BasePage } from '../BasePage/BasePage';
import { OrdersPageDesktop } from './OrdersPageDesktop';
import { OrdersPageMobile } from './OrdersPageMobile';
import { faker } from '@faker-js/faker/locale/en_US';
import { ManagerPage } from '../Desktop/ManagerPage';

const iPhone = devices['iPhone 11']; // Mobile emulation for iPhone 11

export class CombinedPages {
    private desktopOrdersPage: OrdersPageDesktop;
    private mobileOrdersPages: OrdersPageMobile[];
    private managerPage: ManagerPage;
    private static currentOrderNumber = 0;
    private static generatedNames: Set<string> = new Set();

    constructor(page: Page, context: BrowserContext, browser: Browser) {
        this.managerPage = new ManagerPage(page, context, browser);
        this.desktopOrdersPage = new OrdersPageDesktop(page, context, browser, this);
        this.mobileOrdersPages = [];
    }

    static async create() {
        const desktopBrowser = await chromium.launch(); // or `chromium.launch({ headless: false })` for a visible browser
        const desktopContext = await desktopBrowser.newContext();
        const desktopPage = await desktopContext.newPage();
        return new CombinedPages(desktopPage, desktopContext, desktopBrowser);
    }

    public generateOrderNumber() {
        CombinedPages.currentOrderNumber += 1;
        return CombinedPages.currentOrderNumber.toString();
    }

    public generateUniqueOrderName(): string {
        let orderName: string;

        // Keep generating names until a unique one is found
        do {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const lastInitial = lastName.charAt(0).toUpperCase();
            orderName = `${firstName} ${lastInitial}.`;
        } while (CombinedPages.generatedNames.has(orderName)); // Check for uniqueness

        // Add the unique order name to the Set
        CombinedPages.generatedNames.add(orderName);

        return orderName;
    }

    async initMobileBrowsers() {
        const testPassword = process.env.TEST_USER_PASSWORD;
        
        if (!testPassword) {
            throw new Error('TEST_USER_PASSWORD must be set in .env file');
        }
        
        for (const driver of BasePage.todaysDrivers) {
            const mobileBrowser = await chromium.launch({ headless: false });
            const mobileContext = await mobileBrowser.newContext({
                ...iPhone,
            });
            const mobilePage = await mobileContext.newPage();
            const ordersPageMobile = new OrdersPageMobile(mobilePage, mobileContext, mobileBrowser, this, driver);
            await ordersPageMobile.loginWithCredentials(driver.email, testPassword);
            this.mobileOrdersPages.push(ordersPageMobile);
        }
    }

    async addMockOrders(min = 8, max = 15) {
        // randomly choose a mobileOrdersPage or a desktopOrdersPage
        const mockOrders = faker.number.int({ min: min, max: max });
        const weightedIndexWeights: { weight: number; value: OrdersPageDesktop | OrdersPageMobile }[] = [];
        const mobileBrowserWeight = 0.5 / this.mobileOrdersPages.length;
        this.mobileOrdersPages.forEach((ordersPage) => {
            weightedIndexWeights.push({ weight: mobileBrowserWeight, value: ordersPage });
        });
        weightedIndexWeights.push({ weight: 0.5, value: this.desktopOrdersPage });
        this.desktopOrdersPage.logInfo(weightedIndexWeights.map((w) => w.weight).join('+'));
        for (let i = 0; i < mockOrders; i++) {
            const ordersPage = faker.helpers.weightedArrayElement(weightedIndexWeights);

            await ordersPage.addMockOrder();
        }
    }

    async addDriversToDay(drivers: string[]) {
        await this.managerPage.addDriversToDay(drivers);
    }

    async assignOrders() {
        await this.desktopOrdersPage.assignOrders();
    }

    async addMockTips() {
        for (const ordersPageMobile of this.mobileOrdersPages) {
            await ordersPageMobile.addMockTips();
        }
    }

    async closeAllDrawers() {
        await this.managerPage.closeAllDrawers();
    }

    async closeDay() {
        await this.managerPage.closeDay();
    }

    async loginWithCredentials(email: string, password: string) {
        await this.desktopOrdersPage.loginWithCredentials(email, password);
    }

    async quitAllBrowsers() {
        for (const ordersPage of this.mobileOrdersPages) {
            await ordersPage.quitBrowser();
        }
        await this.desktopOrdersPage.quitBrowser();
    }
}
