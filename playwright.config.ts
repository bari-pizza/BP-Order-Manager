import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';
import { loadTestEnv } from './tests/utils/loadEnv';

loadTestEnv();

// Default: local app only. Production is opt-in so `npx playwright test` cannot hit the live shop.
// PLAYWRIGHT_PROD=1 npx playwright test --project=prod

const projects: NonNullable<PlaywrightTestConfig['projects']> = [
    {
        name: 'dev',
        use: {
            baseURL: 'http://localhost:6309',
            headless: false,
            viewport: { width: 1280, height: 720 },
            actionTimeout: 5000,
        },
    },
];

if (process.env.PLAYWRIGHT_PROD === '1') {
    projects.push({
        name: 'prod',
        use: {
            baseURL: 'https://app.bari.pizza',
            headless: false,
            viewport: { width: 1280, height: 720 },
            actionTimeout: 5000,
        },
    });
}

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    projects,
});
