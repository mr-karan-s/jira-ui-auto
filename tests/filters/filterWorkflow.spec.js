const { test } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { FiltersPage } = require('../../pages/FiltersPage');
const { OPEN_STATUSES, CLOSED_STATUSES } = require('../../utils/constants');

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
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);
});
