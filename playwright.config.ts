import { defineConfig, devices,} from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: './utils/secure.env' });

export default defineConfig({
  fullyParallel: true,
  timeout: 1000 * 30,
  testDir: 'tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['allure-playwright', { outputFolder: 'allure-results' }]],
  use: {
    baseURL: 'https://test-commander-48a624c6.base44.app',
    trace: 'on-first-retry',
    testIdAttribute: 'data-testid',
  },

  projects: [
      {
      name: 'setup',
      use: { ...devices['Desktop Chrome'] },
      testDir: './utils',
      testMatch: 'key.spec.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: './utils/loginstate.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: './utils/loginstate.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: './utils/loginstate.json' },
      dependencies: ['setup'],
    },
  ],
});