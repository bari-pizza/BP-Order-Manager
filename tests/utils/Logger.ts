import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { exec } from 'child_process';
// import { chromium } from '@playwright/test';

export class Logger {
    private static filePath: string;
    constructor() {}
    private static logLevels = { debug: 0, info: 1, warn: 2, error: 3 };
    private static logLevel = 1;

    public static setLogLevel(level: string) {
        this.logLevel = this.logLevels[level];
    }

    public static startLog() {
        const timestamp = dayjs().format('YYYY-MM-DD-HH-mm-ss');
        const dir = path.resolve('./test-results');
        fs.mkdirSync(dir, { recursive: true });
        Logger.filePath = path.resolve(dir, timestamp + '-' + 'test-log.html');
        const styleTag = `<style>body { font-family: monospace; } .error { color: red; }</style><h1>Test Log</h1>`;
        fs.writeFileSync(Logger.filePath, styleTag);
    }

    // public static log(message: string) {
    //     const timestamp = dayjs().format('HH-mm-ss');
    //     fs.appendFileSync(Logger.filePath, `[LOG] [${timestamp}] ${message}\n`);
    // }

    public static logDebug(message: string, details?: object) {
        const timestamp = dayjs().format('HH-mm-ss');
        const logMessage = `
            <div style="margin-bottom: 1em; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                <div><strong>[DEBUG] [${timestamp}]</strong> ${message}</div>
                ${
                    details
                        ? `
                    <details style="margin-top: 10px; font-family: monospace;">
                        <summary>Details</summary>
                        <pre>${JSON.stringify(details, null, 2)}</pre>
                    </details>
                `
                        : ''
                }
            </div>
        `;
        fs.appendFileSync(Logger.filePath, logMessage);
    }

    public static logInfo(message: string, details?: object) {
        if (Logger.logLevel > 1) return;
        const timestamp = dayjs().format('HH-mm-ss');
        const logMessage = `
            <div style="margin-bottom: 1em; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                <div><strong>[INFO] [${timestamp}]</strong> ${message}</div>
                ${
                    details
                        ? `
                    <details style="margin-top: 10px; font-family: monospace;">
                        <summary>Details</summary>
                        <pre>${JSON.stringify(details, null, 2)}</pre>
                    </details>
                `
                        : ''
                }
            </div>
        `;
        fs.appendFileSync(Logger.filePath, logMessage);
    }

    public static logWarning(message: string, stack: object) {
        if (Logger.logLevel > 2) return;
        const timestamp = dayjs().format('HH-mm-ss');
        const logMessage = `
            <div style="margin-bottom: 1em; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                <div class="error"><strong>[WARNING] [${timestamp}]</strong> ${message}</div>
                ${
                    stack
                        ? `
                    <details style="margin-top: 10px; font-family: monospace;">
                        <summary>Stack</summary>
                        <pre>${JSON.stringify(stack, null, 2)}</pre>
                    </details>
                `
                        : ''
                }
            </div>
        `;
        fs.appendFileSync(Logger.filePath, logMessage);
    }

    public static logError(message: string, stack: object) {
        if (Logger.logLevel > 3) return;
        const timestamp = dayjs().format('HH-mm-ss');
        const logMessage = `
            <div style="margin-bottom: 1em; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                <div class="error"><strong>[ERROR] [${timestamp}]</strong> ${message}</div>
                ${
                    stack
                        ? `
                    <details style="margin-top: 10px; font-family: monospace;">
                        <summary>Stack</summary>
                        <pre>${JSON.stringify(stack, null, 2)}</pre>
                    </details>
                `
                        : ''
                }
            </div>
        `;
        fs.appendFileSync(Logger.filePath, logMessage);
    }

    public static logRequest(method: string, url: string) {
        const timestamp = dayjs().format('HH-mm-ss');
        fs.appendFileSync(Logger.filePath, `[REQUEST] [${timestamp}] ${method} ${url}\n`);
    }

    public static logResponse(status: number, url: string) {
        const timestamp = dayjs().format('HH-mm-ss');
        fs.appendFileSync(Logger.filePath, `[RESPONSE] [${timestamp}] Status: ${status}, URL: ${url}\n`);
    }

    public static async openLogFile() {
        const fileUrl = `${Logger.filePath.replace(/\\/g, '/')}`;
        console.log(`Open log file: ${fileUrl}`);
        if (process.env.CI) {
            return;
        }
        const chromePath = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`;

        // Launch Chrome with the file URL
        exec(`${chromePath} "${fileUrl}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error opening Chrome: ${error.message}`);
            }
            if (stderr) {
                console.error(`Chrome stderr: ${stderr}`);
            }
            console.log(stdout);
        });
    }
}
