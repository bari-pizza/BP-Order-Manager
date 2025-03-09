import { Browser, BrowserContext, Page, expect } from '@playwright/test';
import { Logger } from '../../utils/Logger';
import dayjs from 'dayjs';
import { Order } from '../../../src/typesAndValidators';
export abstract class BasePage {
    protected page: Page;
    protected context: BrowserContext;
    protected browser: Browser;
    private static mockedCreatedAt: dayjs.Dayjs;
    private static dayStart: dayjs.Dayjs;
    private static dayEnd: dayjs.Dayjs;
    public static todaysDrivers: { email: string; name: string }[] = [];

    constructor(page: Page, context: BrowserContext, browser: Browser) {
        this.page = page;
        this.context = context;
        this.browser = browser;
        this.wrapMethodsWithErrorHandling();
        this.initMockedCreatedAt();
        this.mockRpcCreatedAt();
    }

    async quitBrowser() {
        await this.context.close();
        await this.browser.close();
    }

    initMockedCreatedAt() {
        console.log('initMockedCreatedAt');
        const day = dayjs().day();
        if (day === 0) {
            BasePage.dayStart = dayjs().set('hour', 12).set('minute', 0).set('second', 0).set('millisecond', 0);
            BasePage.dayEnd = dayjs().set('hour', 22).set('minute', 0).set('second', 0).set('millisecond', 0);
        } else {
            BasePage.dayStart = dayjs().set('hour', 11).set('minute', 0).set('second', 0).set('millisecond', 0);
            BasePage.dayEnd = dayjs().set('hour', 23).set('minute', 0).set('second', 0).set('millisecond', 0);
        }
        BasePage.mockedCreatedAt = BasePage.dayStart;
    }

    jumpMockCreatedAt(minutes: number) {
        // add minutes to the mocked created_at timestamp
        const lastTime = BasePage.mockedCreatedAt;
        const newTime = lastTime.add(minutes, 'minute');
        if (newTime > BasePage.dayEnd) {
            BasePage.mockedCreatedAt = BasePage.dayStart;
        } else {
            BasePage.mockedCreatedAt = newTime;
        }
        console.log(`jumped mock created_at from ${lastTime} to ${BasePage.mockedCreatedAt}`);
    }

    async mockSystemTime(fakeNow: number): Promise<void> {
        await this.page.addInitScript(`{
          Date = class extends Date {
            constructor(...args) {
              if (args.length === 0) {
                super(${fakeNow});
              } else {
                super(...args);
              }
            }
          }
    
          const __DateNowOffset = ${fakeNow} - Date.now();
          const __DateNow = Date.now;
          Date.now = () => __DateNow() + __DateNowOffset;
        }`);
    }

    async mockRpcCreatedAt() {
        console.log('mocking created_at');
        const rpcUrlRegex = /\/rest\/v1\/rpc\/create_new_order_from_json$/;

        await this.page.route(rpcUrlRegex, async (route, request) => {
            // Use page.route()
            if (request.method() === 'POST') {
                try {
                    const { p_order_json }: { p_order_json: Order } = await request.postDataJSON();
                    console.log({ p_order_json });

                    if (p_order_json) {
                        const modifiedData = {
                            p_order_json: {
                                ...p_order_json,
                                created_at: BasePage.mockedCreatedAt.toISOString(),
                            },
                        };

                        await route.continue({
                            // Use route.continue()
                            postData: JSON.stringify(modifiedData),
                        });
                        console.log(
                            `Mocked created_at for order ${p_order_json.order_name || p_order_json.order_number} as: ${BasePage.mockedCreatedAt.toISOString()}`,
                        );
                    } else {
                        console.warn('Request to create_new_order_from_json had no postData.');
                        await route.continue();
                    }
                } catch (error) {
                    console.error('Error modifying request body:', error);
                    await route.continue();
                }
            } else {
                await route.continue(); // Important: Let non-POST requests continue
            }
        });
        // await this.page.route('**/rest/v1/rpc/create_new_order_from_json', async (route) => {
        //     const request = route.request();
        //     const postData = await request.postDataJSON();

        //     // Modify the request body to add a mock created_at timestamp
        //     const modifiedData = {
        //         ...postData,
        //         created_at: this.mockedCreatedAt, // Use the stored timestamp
        //     };

        //     // Continue the request with the modified body
        //     await route.continue({ postData: JSON.stringify(modifiedData) });
        //     console.log(`Mocked created_at: ${this.mockedCreatedAt}`);

        //     // console.log(`Mocked created_at: ${this.mockedCreatedAt}, modifiedData: ${JSON.stringify(modifiedData)}`);
        // });
    }

    logInfo(message: string, details?: object) {
        Logger.logInfo(message, details);
    }

    logError(error: Error, context?: string) {
        Logger.logError(`Error in ${context}: ${error.message}`, { stack: error.stack });
    }

    openLogger() {
        Logger.openLogFile();
    }

    // Method to wrap all class methods with error handling
    private wrapMethodsWithErrorHandling() {
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((methodName) => methodName !== 'constructor' && typeof (this as any)[methodName] === 'function');

        for (const methodName of methodNames) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const originalMethod = (this as any)[methodName];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any)[methodName] = async (...args: any[]) => {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    this.logError(error, methodName);
                    this.openLogger();
                    throw error; // Rethrow the error
                }
            };
        }
    }

    // Common navigation methods

    protected async navigateToHref(href: string) {
        // check if already on the right page
        if (this.page.url() === href) return;
        const link = this.page.locator(`a[href="${href}"]`);
        await expect(link).toBeVisible();
        await link.click();
        await expect(this.page).toHaveURL(href);
        Logger.logInfo(`Navigated to ${href}`);
        await this.page.mouse.move(0, 0);
    }

    async navigateToHome() {
        await this.navigateToHref('/');
    }

    async navigateToOrders() {
        await this.navigateToHref('/orders');
        // make sure page has loaded
        await expect(this.page.locator('_react=OrderDashboard').nth(0)).toBeVisible();
    }

    async loginWithCredentials(email: string, password: string) {
        await this.page.goto('/login');

        const emailInput = this.page.locator('input[name="email"]');
        const passwordInput = this.page.locator('input[name="password"]');
        const loginButton = this.page.locator('button:has-text("Sign In")');

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(loginButton).toBeVisible();

        await emailInput.fill(email);
        await passwordInput.fill(password);
        await loginButton.click();
        Logger.logInfo(`Logged in as ${email}`);
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async takeScreenshot(filename: string): Promise<void> {
        await this.page.screenshot({ path: filename });
    }

    async startTimeout(seconds: number, message = 'Time remaining:') {
        // Inject a timer element into the DOM
        await this.page.evaluate(() => {
            const timerDiv = document.createElement('div');
            timerDiv.id = 'playwright-timer';
            timerDiv.style.position = 'fixed';
            timerDiv.style.top = '10px';
            timerDiv.style.right = '10px';
            timerDiv.style.backgroundColor = '#000';
            timerDiv.style.color = '#fff';
            timerDiv.style.padding = '10px';
            timerDiv.style.borderRadius = '5px';
            timerDiv.style.fontSize = '16px';
            timerDiv.style.zIndex = '10000';
            document.body.appendChild(timerDiv);
        });

        // Countdown logic with optional message
        for (let i = seconds; i > 0; i -= 0.1) {
            await this.page.evaluate(
                (args: { timeLeft: number; msg: string }) => {
                    const timerDiv = document.getElementById('playwright-timer');
                    if (timerDiv) {
                        timerDiv.textContent = `${args.msg ? args.msg + ' ' : ''} ${args.timeLeft.toFixed(1)}s`;
                    }
                },
                { timeLeft: i, msg: message },
            );

            // Wait for 1 second
            await this.page.waitForTimeout(100);
        }

        // Cleanup the timer element after timeout
        await this.page.evaluate(() => {
            const timerDiv = document.getElementById('playwright-timer');
            if (timerDiv) {
                timerDiv.remove();
            }
        });
    }

    getURL() {
        return this.page.url();
    }

    async setDateInDatePicker(date: dayjs.Dayjs) {
        const [yyyy, mmmm, d] = date.format('YYYY-MMMM-D').split('-');

        await this.page.locator('.date-picker-button').click();
        const calendarHeader = await this.page.locator('.MuiPickersCalendarHeader-label').textContent();
        expect(calendarHeader).not.toBeNull();
        const [month, year] = calendarHeader!.split(' ');
        const day = await this.page.locator('.MuiPickersDay-root.Mui-selected').textContent();
        expect(day).not.toBeNull();

        if (year !== yyyy) {
            await this.page.locator('.MuiPickersCalendarHeader-switchViewButton').click();
            await this.page.locator(`.MuiPickersYear-yearButton >> text=${yyyy}`).click();
            await this.setDateInDatePicker(date);
            console.log(`set year to ${yyyy}`);
            return;
        }

        if (month !== mmmm) {
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            const nextCount = months.indexOf(mmmm) - months.indexOf(month);
            if (nextCount > 0) {
                // go forward x months
                for (let i = 0; i < nextCount; i++) {
                    await this.page.locator('.MuiPickersArrowSwitcher-nextIconButton').click();
                }
            } else {
                // go back x months
                for (let i = 0; i > nextCount; i--) {
                    await this.page.locator('.MuiPickersArrowSwitcher-previousIconButton').click();
                }
            }
            console.log(`went back one month`);
        }
        if (day !== d) {
            // click on day
            const timestamp = date.valueOf();
            await this.page.locator(`.MuiPickersDay-root[data-timestamp="${timestamp}"]`).click();
            console.log(`clicked on day ${d}`);
            return;
        }
    }
}
