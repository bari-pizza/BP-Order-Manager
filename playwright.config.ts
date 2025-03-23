import { defineConfig } from '@playwright/test';

// npx playwright test --grep="dev"
// npx playwright test --grep="prod"

export default defineConfig({
    testDir: './tests', // Directory for E2E tests
    retries: 0, // Number of retries on failures
    projects: [
        {
            name: 'dev',
            use: {
                baseURL: 'http://localhost:5173',
                headless: false,
                viewport: { width: 1280, height: 720 },
                actionTimeout: 5000,
            },
        },
        {
            name: 'prod',
            use: {
                baseURL: 'https://app.bari.pizza',
                headless: false,
                viewport: { width: 1280, height: 720 },
                actionTimeout: 5000,
            },
        },
    ],
});
