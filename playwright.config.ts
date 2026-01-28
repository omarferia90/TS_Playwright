import { defineConfig, devices } from '@playwright/test';
import { environments } from './config/environments';
import dotenv from 'dotenv';

//Load environment variables
dotenv.config();
const environment = process.env.ENVIRONMENT || 'qa';



/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  expect: {
    timeout: 6000,
  },
  use: {
    trace: 'off',
    actionTimeout: environments[environment]?.timeout || 30000,
    navigationTimeout: environments[environment]?.timeout || 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    //{ name: 'setup', testMatch: /.*\.setup\.ts/ }, //Login for Reusable Authentication
    {
      name: 'QA',
      timeout: 70000, //Execution time before timeout
      use: { 
        ...devices['Desktop Chrome'], 
        baseURL: environments.qa.baseUrl,
        headless: environments.qa.headless,
        viewport: { width: 1600, height: 900 },
        //storageState: '.auth/user.json'
      },
      //dependencies: ['setup'], //Dependencies for Reusable Authentication
    },
  ],
});
