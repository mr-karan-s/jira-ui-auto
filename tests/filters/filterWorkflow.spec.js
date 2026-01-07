const { test, expect } = require('@playwright/test');

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

  // ===== TEST SCENARIO 1: OPEN STATUS FILTER =====

  // Step 5: Create filter
  await filtersPage.clickCreateFilter();

  // Step 6: Select Open statuses (Open, To Do, In Progress)
  await filtersPage.selectStatusFilters(OPEN_STATUSES);

  // Step 7–8: BUSINESS LOGIC - Validate results contain only Open statuses
  const openStatusResults = await filtersPage.getResultStatuses();
  if (openStatusResults.length > 0) {
    // Verify all returned statuses are in the OPEN_STATUSES list
    openStatusResults.forEach((status) => {
      expect(OPEN_STATUSES).toContain(status);
    });
  } else {
    console.warn('No issues returned for the applied filter');
  }

  // ===== TEST SCENARIO 2: CLEAR FILTERS =====

  // Step 9: Clear existing filters
  await filtersPage.clearAllFilters();

  // ===== TEST SCENARIO 3: CLOSED / DONE STATUS FILTER =====

  // Step 10: Create filter
  await filtersPage.clickCreateFilter();

  // Step 11: Select Closed/Done statuses
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);

  // Step 12–13: BUSINESS LOGIC - Validate results contain only Closed/Done statuses
  const closedStatusResults = await filtersPage.getResultStatuses();
  if (closedStatusResults.length > 0) {
    // Verify all returned statuses are in the CLOSED_STATUSES list
    closedStatusResults.forEach((status) => {
      expect(CLOSED_STATUSES).toContain(status);
    });
  } else {
    console.warn('No issues returned for the applied filter');
  }
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

  // ===== TEST SCENARIO 1: OPEN STATUS FILTER + JQL VALIDATION =====

  // Step 5: Create filter
  await filtersPage.clickCreateFilter();

  // Step 6: Select Open statuses (Open, To Do, In Progress)
  await filtersPage.selectStatusFilters(OPEN_STATUSES);

  // Step 7: BUSINESS LOGIC - Validate results contain only Open statuses
  const openStatusResults = await filtersPage.getResultStatuses();
  if (openStatusResults.length > 0) {
    openStatusResults.forEach((status) => {
      expect(OPEN_STATUSES).toContain(status);
    });
  } else {
    console.warn('No issues returned for the applied filter');
  }

  // Step 8: Switch to JQL to validate the query
  await filtersPage.switchToJQL();

  // Step 9: Get the JQL query text
  const jqlQuery = await filtersPage.getJQLQueryText();
  console.log('JQL Query for Open Statuses:', jqlQuery);

  // Step 10: BUSINESS LOGIC - Validate JQL query contains expected status criteria
  expect(jqlQuery).toMatch(OPEN_STATUSES_JQL_PATTERN);

  // Step 11: BUSINESS LOGIC - Validate results in JQL view still match Open statuses
  const openStatusResultsInJQL = await filtersPage.getResultStatuses();
  if (openStatusResultsInJQL.length > 0) {
    openStatusResultsInJQL.forEach((status) => {
      expect(OPEN_STATUSES).toContain(status);
    });
  }

  // Step 12: Switch back to basic search
  await filtersPage.switchToBasic();

  // ===== TEST SCENARIO 2: CLEAR FILTERS =====

  // Step 13: Clear existing filters
  await filtersPage.clearAllFilters();

  // ===== TEST SCENARIO 3: CLOSED STATUS FILTER + JQL VALIDATION =====

  // Step 14: Create filter
  await filtersPage.clickCreateFilter();

  // Step 15: Select Closed/Done statuses
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);

  // Step 16: BUSINESS LOGIC - Validate results contain only Closed/Done statuses
  const closedStatusResults = await filtersPage.getResultStatuses();
  if (closedStatusResults.length > 0) {
    closedStatusResults.forEach((status) => {
      expect(CLOSED_STATUSES).toContain(status);
    });
  } else {
    console.warn('No issues returned for the applied filter');
  }

  // Step 17: Switch to JQL to validate the query
  await filtersPage.switchToJQL();

  // Step 18: Get the JQL query text
  const jqlQueryClosed = await filtersPage.getJQLQueryText();
  console.log('JQL Query for Closed Statuses:', jqlQueryClosed);

  // Step 19: BUSINESS LOGIC - Validate JQL query contains expected status criteria
  expect(jqlQueryClosed).toMatch(CLOSED_STATUSES_JQL_PATTERN);

  // Step 20: BUSINESS LOGIC - Validate results in JQL view still match Closed statuses
  const closedStatusResultsInJQL = await filtersPage.getResultStatuses();
  if (closedStatusResultsInJQL.length > 0) {
    closedStatusResultsInJQL.forEach((status) => {
      expect(CLOSED_STATUSES).toContain(status);
    });
  }

  // Step 21: Switch back to basic search
  await filtersPage.switchToBasic();
});
