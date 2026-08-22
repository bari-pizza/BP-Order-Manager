import { chromium, devices, test, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { BasePage } from '../BasePage/BasePage';
import { OrdersPageDesktop } from './OrdersPageDesktop';
import { OrdersPageMobile } from './OrdersPageMobile';
import { faker } from '@faker-js/faker/locale/en_US';
import { ManagerPage } from '../desktop/ManagerPage';
import { passwordForEmail } from '../../utils/testAccounts';

const iPhone = devices['iPhone 11']; // Mobile emulation for iPhone 11
const isCi = !!process.env.CI;

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

    static resetGeneratedOrders() {
        CombinedPages.currentOrderNumber = 0;
        CombinedPages.generatedNames = new Set();
    }

    static async create() {
        const baseURL = String(test.info().project.use.baseURL || 'http://localhost:6309');
        const desktopBrowser = await chromium.launch({ headless: isCi });
        const desktopContext = await desktopBrowser.newContext({
            baseURL,
            viewport: { width: 1280, height: 720 },
            ...(isCi ? { recordVideo: { dir: 'test-results/extra-videos' } } : {}),
        });
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
        const baseURL = String(test.info().project.use.baseURL || 'http://localhost:6309');
        for (const driver of BasePage.todaysDrivers) {
            const mobileBrowser = await chromium.launch({ headless: isCi });
            const mobileContext = await mobileBrowser.newContext({
                ...iPhone,
                baseURL,
                ...(isCi ? { recordVideo: { dir: 'test-results/extra-videos' } } : {}),
            });
            const mobilePage = await mobileContext.newPage();
            const ordersPageMobile = new OrdersPageMobile(mobilePage, mobileContext, mobileBrowser, this, driver);
            await ordersPageMobile.loginWithCredentials(driver.email, passwordForEmail(driver.email));
            await ordersPageMobile.waitForToastsToClear();
            this.mobileOrdersPages.push(ordersPageMobile);
        }
    }

    async addMockOrders(min = 8, max = 15) {
        // Desktop-only until BAR-13: login/realtime toasts cover the phone Speed Dial.
        await this.desktopOrdersPage.addMockOrders(min, max);
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

    async reloadDesktop() {
        await this.managerPage.reload();
    }

    async quitMobileBrowsers() {
        for (const ordersPage of this.mobileOrdersPages) {
            await ordersPage.quitBrowser();
        }
        this.mobileOrdersPages = [];
    }

    async quitAllBrowsers() {
        await this.quitMobileBrowsers();
        await this.desktopOrdersPage.quitBrowser();
    }
}
