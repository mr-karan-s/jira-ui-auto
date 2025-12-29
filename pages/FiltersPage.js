class FiltersPage {
  constructor(page) {
    this.page = page;
    this.constants = require('../utils/constants');

    // Locator that confirms Filters page is loaded
    this.filtersPageHeader = 'text=Filters';

    // Locator for Create filter button
    this.createFilterButton = 'text=Create filter';

    // Locator for Status column in results table
    this.statusColumn = '[data-testid="issue.status"]';

    // Locator for status filter dropdown
    this.statusDropdown = '[data-testid="status.ui.filter.dropdown"]';

    // Locator for clear filters button
    this.clearFiltersButton = 'text=Clear';

    // Locator for Switch to JQL button/link
    this.switchToJQLButton = 'text=Switch to JQL';

    // Locator for JQL input field
    this.jqlInputField = 'input[data-testid="jql.input"]';

    // Locator for Switch to basic button/link
    this.switchToBasicButton = 'text=Switch to basic';
  }

  async waitForFiltersPageToLoad() {
    // Confirms navigation to Filters page
    await this.page.waitForSelector(this.filtersPageHeader, {
      timeout: this.constants.TIMEOUTS.PAGE_LOAD,
    });
  }

  async clickCreateFilter() {
    await this.page.click(this.createFilterButton);
  }

  async validateStatusesInResults(expectedStatuses) {
    const statusCells = this.page.locator(this.statusColumn);
    const count = await statusCells.count();

    // Optional but good: handle empty results gracefully
    if (count === 0) {
      console.warn('No issues returned for the applied filter');
      return;
    }

    for (let i = 0; i < count; i++) {
      const statusText = await statusCells.nth(i).innerText();

      if (!expectedStatuses.includes(statusText)) {
        throw new Error(
          `Unexpected status found: ${statusText}. Expected one of: ${expectedStatuses.join(', ')}`
        );
      }
    }
  }

  async selectStatusFilters(statuses) {
    // Validate input: ensure statuses is an array and not empty
    if (!Array.isArray(statuses) || statuses.length === 0) {
      throw new Error('At least one status must be provided as an array.');
    }

    // Validate each status against whitelist
    const invalidStatuses = statuses.filter(
      (status) => !this.constants.ALLOWED_STATUSES.includes(status)
    );
    if (invalidStatuses.length > 0) {
      throw new Error(
        `Invalid status values: ${invalidStatuses.join(', ')}. Allowed: ${this.constants.ALLOWED_STATUSES.join(', ')}`
      );
    }

    // Click the status dropdown to open it
    await this.page.click(this.statusDropdown);

    // Wait for dropdown to be visible
    await this.page.waitForSelector('[role="listbox"]', {
      timeout: this.constants.TIMEOUTS.DROPDOWN_OPEN,
    });

    // Select each status checkbox
    for (const status of statuses) {
      const statusCheckbox = this.page.locator(`input[value="${status}"]`);

      // Validate that the checkbox element exists before interaction
      const count = await statusCheckbox.count();
      if (count === 0) {
        throw new Error(`Status checkbox for "${status}" not found in the filter dropdown`);
      }

      await statusCheckbox.check();
    }

    // Click outside the dropdown or press Escape to close it
    await this.page.keyboard.press('Escape');
  }

  async clearAllFilters() {
    // Click the clear filters button
    await this.page.click(this.clearFiltersButton);

    // Wait for filters to be cleared
    await this.page.waitForTimeout(this.constants.TIMEOUTS.FILTER_CLEAR);
  }

  async switchToJQL() {
    // Click the "Switch to JQL" button/link
    await this.page.click(this.switchToJQLButton);

    // Wait for JQL input field to be visible
    await this.page.waitForSelector(this.jqlInputField, {
      timeout: this.constants.TIMEOUTS.QUICK_ACTION,
    });
  }

  async getJQLQueryText() {
    // Get the text/value from the JQL input field
    const jqlInputElement = this.page.locator(this.jqlInputField);
    const jqlQuery = await jqlInputElement.inputValue();
    return jqlQuery;
  }

  async switchToBasic() {
    // Click the "Switch to basic" button/link
    await this.page.click(this.switchToBasicButton);

    // Wait for filters page to be visible again (basic view)
    await this.page.waitForSelector(this.filtersPageHeader, {
      timeout: this.constants.TIMEOUTS.QUICK_ACTION,
    });
  }
}

module.exports = { FiltersPage };
