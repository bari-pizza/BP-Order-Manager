import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';
import { loadTestEnv } from './tests/utils/loadEnv';

loadTestEnv();

// Default: local app only. Production is opt-in so `npx playwright test` cannot hit the live shop.
// PLAYWRIGHT_PROD=1 npx playwright test --project=prod

const isCi = !!process.env.CI;

const projects: NonNullable<PlaywrightTestConfig['projects']> = [
    {
        name: 'dev',
        use: {
            baseURL: 'http://localhost:6309',
            headless: isCi,
            viewport: { width: 1280, height: 720 },
            actionTimeout: 5000,
            video: isCi ? 'on' : 'off',
            trace: isCi ? 'on' : 'off',
            screenshot: isCi ? 'on' : 'off',
        },
    },
];

if (process.env.PLAYWRIGHT_PROD === '1') {
    projects.push({
        name: 'prod',
        use: {
            baseURL: 'https://app.bari.pizza',
            headless: isCi,
            viewport: { width: 1280, height: 720 },
            actionTimeout: 5000,
            video: isCi ? 'on' : 'off',
            trace: isCi ? 'on' : 'off',
            screenshot: isCi ? 'on' : 'off',
        },
    });
}

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    reporter: isCi ? [['list'], ['html', { open: 'never' }]] : 'list',
    outputDir: 'test-results',
    projects,
});
