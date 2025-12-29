const { test } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { FiltersPage } = require('../../pages/FiltersPage');
const { 
  OPEN_STATUSES, 
  CLOSED_STATUSES,
  OPEN_STATUSES_JQL_PATTERN,
  CLOSED_STATUSES_JQL_PATTERN
} = require('../../utils/constants');

test('Validate Open and Closed Jira Status Filters', async ({ page }) => {
  // Initialize page objects
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const filtersPage = new FiltersPage(page);

  // Step 1–3: Login and land on homepage
  await loginPage.login(
    process.env.JIRA_USERNAME,
    process.env.JIRA_PASSWORD
  );
  await homePage.waitForHomePageToLoad();

  // Step 4–6: Navigate to Filters page
  await homePage.navigateToFiltersPage();
  await filtersPage.waitForFiltersPageToLoad();

  // ===== OPEN STATUS FILTER =====

  // Step 7: Create filter
  await filtersPage.clickCreateFilter();

  // Step 8: Select Open statuses (Open, To Do, In Progress)
  await filtersPage.selectStatusFilters(OPEN_STATUSES);

  // Step 9–10: Validate results contain only Open statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);

  // ===== CLEAR FILTERS =====

  // Step 11: Clear existing filters
  await filtersPage.clearAllFilters();

  // ===== CLOSED / DONE STATUS FILTER =====

  // Step 12: Create filter
  await filtersPage.clickCreateFilter();

  // Step 13: Select Closed/Done statuses
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);

  // Step 14–15: Validate results contain only Closed/Done statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);
});

test('Validate JQL Query matches Applied Filters', async ({ page }) => {
  // Initialize page objects
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const filtersPage = new FiltersPage(page);

  // Step 1–3: Login and land on homepage
  await loginPage.login(
    process.env.JIRA_USERNAME,
    process.env.JIRA_PASSWORD
  );
  await homePage.waitForHomePageToLoad();

  // Step 4–6: Navigate to Filters page
  await homePage.navigateToFiltersPage();
  await filtersPage.waitForFiltersPageToLoad();

  // ===== OPEN STATUS FILTER + JQL VALIDATION =====

  // Step 7: Create filter
  await filtersPage.clickCreateFilter();

  // Step 8: Select Open statuses (Open, To Do, In Progress)
  await filtersPage.selectStatusFilters(OPEN_STATUSES);

  // Step 9: Validate results contain only Open statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);

  // Step 10: Switch to JQL to validate the query
  await filtersPage.switchToJQL();

  // Step 11: Get the JQL query text
  const jqlQuery = await filtersPage.getJQLQueryText();
  console.log('JQL Query for Open Statuses:', jqlQuery);

  // Step 12: Validate JQL query contains expected status criteria
  if (!OPEN_STATUSES_JQL_PATTERN.test(jqlQuery)) {
    throw new Error(
      `JQL query does not match Open statuses pattern. Query: ${jqlQuery}`
    );
  }

  // Step 13: Validate results in JQL view still match Open statuses
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);

  // Step 14: Switch back to basic search
  await filtersPage.switchToBasic();

  // ===== CLEAR FILTERS =====

  // Step 15: Clear existing filters
  await filtersPage.clearAllFilters();

  // ===== CLOSED STATUS FILTER + JQL VALIDATION =====

  // Step 16: Create filter
  await filtersPage.clickCreateFilter();

  // Step 17: Select Closed/Done statuses
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);

  // Step 18: Validate results contain only Closed/Done statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);

  // Step 19: Switch to JQL to validate the query
  await filtersPage.switchToJQL();

  // Step 20: Get the JQL query text
  const jqlQueryClosed = await filtersPage.getJQLQueryText();
  console.log('JQL Query for Closed Statuses:', jqlQueryClosed);

  // Step 21: Validate JQL query contains expected status criteria
  if (!CLOSED_STATUSES_JQL_PATTERN.test(jqlQueryClosed)) {
    throw new Error(
      `JQL query does not match Closed statuses pattern. Query: ${jqlQueryClosed}`
    );
  }

  // Step 22: Validate results in JQL view still match Closed statuses
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);

  // Step 23: Switch back to basic search
  await filtersPage.switchToBasic();
});
