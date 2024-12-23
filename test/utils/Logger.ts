import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

export class Logger {
    private filePath: string;
    constructor(filePath = 'test-log.html') {
        const timestamp = dayjs().format('YYYY-MM-DD-HH-mm');
        this.filePath = path.resolve('./test-results/' + timestamp + '-' + filePath);
        // Initialize the log file by clearing or creating it
        const styleTag = `<style>body { font-family: monospace; } .error { color: red; }</style>`;
        fs.writeFileSync(this.filePath, styleTag);
    }

    log(message: string) {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(this.filePath, `[LOG] [${timestamp}] ${message}\n`);
    }

    // logInfo(message: string, details?: object) {
    //     const timestamp = new Date().toISOString();
    //     fs.appendFileSync(this.filePath, `[INFO] [${timestamp}] ${message}\n`);
    //     if (details) {
    //         const prettifiedDetails = JSON.stringify(details, null, 2); // Prettify the JSON
    //         fs.appendFileSync(this.filePath, prettifiedDetails + '\n');
    //     }
    // }

    logInfo(message: string, details?: object) {
        const timestamp = new Date().toISOString();
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
        fs.appendFileSync(this.filePath, logMessage);
    }

    logError(message: string, stack: object) {
        const timestamp = new Date().toISOString();
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
        fs.appendFileSync(this.filePath, logMessage);
        // fs.appendFileSync(this.filePath, `[ERROR] [${timestamp}] ${message}\n`);
    }

    logRequest(method: string, url: string) {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(this.filePath, `[REQUEST] [${timestamp}] ${method} ${url}\n`);
    }

    logResponse(status: number, url: string) {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(this.filePath, `[RESPONSE] [${timestamp}] Status: ${status}, URL: ${url}\n`);
    }
}
