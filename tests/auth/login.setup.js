const { chromium } = require('@playwright/test');
require('dotenv').config();

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  

  //Go to Jira login page

  await page.goto(process.env.JIRA_URL);

  await page.fill('#username', process.env.JIRA_USERNAME);
  await page.click('#login-submit');

  await page.fill('#password', process.env.JIRA_PASSWORD);
  await page.click('#login-submit');


   // Wait until Jira homepage is loaded
  await page.waitForURL('**/jira/**', { timeout: 10000 });


   // Save login session
  await page.context().storageState({ path: 'storageState.json' });

  await browser.close();
}

module.exports = globalSetup;


