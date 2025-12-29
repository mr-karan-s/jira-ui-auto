const { test } = require('@playwright/test');

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
  const homePage = new HomePage(page);
  const filtersPage = new FiltersPage(page);

  // Note: Global setup handles authentication, session is restored from storageState.json

  // Step 1–2: Wait for homepage to load (already authenticated)
  await homePage.waitForHomePageToLoad();

  // Step 3–4: Navigate to Filters page
  await homePage.navigateToFiltersPage();
  await filtersPage.waitForFiltersPageToLoad();

  // ===== OPEN STATUS FILTER =====

  // Step 5: Create filter
  await filtersPage.clickCreateFilter();

  // Step 6: Select Open statuses (Open, To Do, In Progress)
  await filtersPage.selectStatusFilters(OPEN_STATUSES);

  // Step 7–8: Validate results contain only Open statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);

  // ===== CLEAR FILTERS =====

  // Step 9: Clear existing filters
  await filtersPage.clearAllFilters();

  // ===== CLOSED / DONE STATUS FILTER =====

  // Step 10: Create filter
  await filtersPage.clickCreateFilter();

  // Step 11: Select Closed/Done statuses
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);

  // Step 12–13: Validate results contain only Closed/Done statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);
});

test('Validate JQL Query matches Applied Filters', async ({ page }) => {
  // Initialize page objects
  const homePage = new HomePage(page);
  const filtersPage = new FiltersPage(page);

  // Note: Global setup handles authentication, session is restored from storageState.json

  // Step 1–2: Wait for homepage to load (already authenticated)
  await homePage.waitForHomePageToLoad();

  // Step 3–4: Navigate to Filters page
  await homePage.navigateToFiltersPage();
  await filtersPage.waitForFiltersPageToLoad();

  // ===== OPEN STATUS FILTER + JQL VALIDATION =====

  // Step 5: Create filter
  await filtersPage.clickCreateFilter();

  // Step 6: Select Open statuses (Open, To Do, In Progress)
  await filtersPage.selectStatusFilters(OPEN_STATUSES);

  // Step 7: Validate results contain only Open statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);

  // Step 8: Switch to JQL to validate the query
  await filtersPage.switchToJQL();

  // Step 9: Get the JQL query text
  const jqlQuery = await filtersPage.getJQLQueryText();
  console.log('JQL Query for Open Statuses:', jqlQuery);

  // Step 10: Validate JQL query contains expected status criteria
  if (!OPEN_STATUSES_JQL_PATTERN.test(jqlQuery)) {
    throw new Error(
      `JQL query does not match Open statuses pattern. Query: ${jqlQuery}`
    );
  }

  // Step 11: Validate results in JQL view still match Open statuses
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);

  // Step 12: Switch back to basic search
  await filtersPage.switchToBasic();

  // ===== CLEAR FILTERS =====

  // Step 13: Clear existing filters
  await filtersPage.clearAllFilters();

  // ===== CLOSED STATUS FILTER + JQL VALIDATION =====

  // Step 14: Create filter
  await filtersPage.clickCreateFilter();

  // Step 15: Select Closed/Done statuses
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);

  // Step 16: Validate results contain only Closed/Done statuses
  // (Handles empty results gracefully - logs warning and continues)
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);

  // Step 17: Switch to JQL to validate the query
  await filtersPage.switchToJQL();

  // Step 18: Get the JQL query text
  const jqlQueryClosed = await filtersPage.getJQLQueryText();
  console.log('JQL Query for Closed Statuses:', jqlQueryClosed);

  // Step 19: Validate JQL query contains expected status criteria
  if (!CLOSED_STATUSES_JQL_PATTERN.test(jqlQueryClosed)) {
    throw new Error(
      `JQL query does not match Closed statuses pattern. Query: ${jqlQueryClosed}`
    );
  }

  // Step 20: Validate results in JQL view still match Closed statuses
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);

  // Step 21: Switch back to basic search
  await filtersPage.switchToBasic();
});
