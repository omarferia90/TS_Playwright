import { test, expect } from '../../tests/fixtures/BaseTest';
import { BasePage } from '../../tests/pages/BasePage';


test.describe('', () => {

    test('has title', async ({ page, testInfo }) => {
      await page.goto('https://playwright.dev/');

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Playwright/);
      console.log('[Test - ✅ Has title]');

    });

    test('get started link', async ({ page, testInfo }) => {
      await page.goto('https://playwright.dev/');

      // Click the get started link.
      await page.getByRole('link', { name: 'Get started' }).click();

      // Expects page to have a heading with the name of Installation.
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
      console.log('[Test - ✅ Has heading]');
    });

});


