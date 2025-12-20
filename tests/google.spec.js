const { test, expect } = require('@playwright/test');

test('Open Google and verify page title', async ({ page }) => {
     await page.goto('https://www.google.com');
     await expect(page).toHaveTitle(/Google/);
});