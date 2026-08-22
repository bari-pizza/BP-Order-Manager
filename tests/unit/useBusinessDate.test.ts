import { test, expect, Browser, BrowserContext, chromium } from '@playwright/test';
import dayjs from 'dayjs';
// import { ManagerPage } from '../pages/desktop/ManagerPage';
import { OrdersPageDesktop } from '../pages/OrdersPage/OrdersPageDesktop';
// import { OrdersPageMobile } from '../pages/OrdersPage/OrdersPageMobile';

let desktopBrowser: Browser;
let desktopContext: BrowserContext;
// let mobileBrowser: Browser;
// let mobileContext: BrowserContext;
// let managerPage: ManagerPage;
let ordersPageDesktop: OrdersPageDesktop;
// let ordersPageMobile: OrdersPageMobile;

// const iPhone = devices['iPhone 11']; // Mobile emulation for iPhone 11
const fakeNow = new Date().setHours(23, 59, 55, 0);

test.beforeAll(async () => {
    // Start a single browser instance and context
    desktopBrowser = await chromium.launch(); // or `chromium.launch({ headless: false })` for a visible browser
    desktopContext = await desktopBrowser.newContext();
    const desktopPage = await desktopContext.newPage();
    // managerPage = new ManagerPage(desktopPage);
    ordersPageDesktop = new OrdersPageDesktop(desktopPage);
    await ordersPageDesktop.mockSystemTime(fakeNow);
    await ordersPageDesktop.login();

    // mobileBrowser = await chromium.launch({ headless: false });
    // mobileContext = await mobileBrowser.newContext({
    //     ...iPhone,
    // });
    // const mobilePage = await mobileContext.newPage();
    // ordersPageMobile = new OrdersPageMobile(mobilePage);
    // await ordersPageMobile.login();
});

test.afterAll(async () => {
    // Close the browser after all tests
    await desktopContext.close();
    await desktopBrowser.close();

    // await mobileContext.close();
    // await mobileBrowser.close();
});

test('handles midnight logic correctly (no business date in url)', async () => {
    await ordersPageDesktop.startTimeout(10);

    const url = ordersPageDesktop.getURL();
    const today = dayjs(fakeNow).format('YYYY-MM-DD');
    expect(url).toContain(`businessDate=${today}`);
});

test('handles midnight logic correctly (with business date in url)', async () => {
    const dateStr = '2023-09-25';
    await ordersPageDesktop.setDateInDatePicker(dayjs(dateStr));
    await ordersPageDesktop.startTimeout(10);

    // Assert that the URL contains the updated business date
    const url = ordersPageDesktop.getURL();
    expect(url).toContain(`?businessDate=${dateStr}`);
});
