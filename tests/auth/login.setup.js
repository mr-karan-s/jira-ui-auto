require('dotenv').config({ path: '.env' });
const { chromium } = require('@playwright/test');
const fs = require('fs');

async function globalSetup() {
  // Validate required environment variables
  if (!process.env.JIRA_URL || !process.env.JIRA_USERNAME || !process.env.JIRA_PASSWORD) {
    throw new Error(
      'Missing required environment variables: JIRA_URL, JIRA_USERNAME, JIRA_PASSWORD. Check your .env file.'
    );
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Go to Jira login page
  await page.goto(process.env.JIRA_URL);

  await page.fill('#username', process.env.JIRA_USERNAME);
  await page.click('#login-submit');

  // Enter password and submit
  await page.fill('#password', process.env.JIRA_PASSWORD);
  await page.click('#login-submit');

  // Wait until Jira homepage is loaded
  await page.waitForURL('**/jira/**', { timeout: 10000 });

  // Save login session
  await page.context().storageState({ path: 'storageState.json' });

  await browser.close();

  // Validate that storage state was saved successfully
  if (!fs.existsSync('storageState.json')) {
    throw new Error(
      'Failed to save authentication session (storageState.json). Check your Jira credentials and try again.'
    );
  }

  console.log('✅ Authentication successful - session saved to storageState.json');
}

module.exports = globalSetup;
