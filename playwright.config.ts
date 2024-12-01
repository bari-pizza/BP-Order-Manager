import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test/e2e', // Directory for E2E tests
    retries: 0, // Number of retries on failures
    use: {
        baseURL: 'http://localhost:5173', // URL of your app
        // headless: true, // Set to false for debugging with the browser open
        headless: false,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 5000, // Timeout for each action
    },
});
