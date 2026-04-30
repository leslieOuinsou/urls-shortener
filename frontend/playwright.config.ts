import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    workers: 1,
    globalSetup: './tests/global-setup.ts',
    use: {
        baseURL: 'http://localhost:3000',
    },
});