class FiltersPage {
  constructor(page) {
    this.page = page;

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
      timeout: 30000,
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
    // Click the status dropdown to open it
    await this.page.click(this.statusDropdown);

    // Wait for dropdown to be visible
    await this.page.waitForSelector('[role="listbox"]', { timeout: 10000 });

    // Select each status checkbox
    for (const status of statuses) {
      const statusCheckbox = this.page.locator(`input[value="${status}"]`);
      await statusCheckbox.check();
    }

    // Click outside the dropdown or press Escape to close it
    await this.page.keyboard.press('Escape');
  }

  async clearAllFilters() {
    // Click the clear filters button
    await this.page.click(this.clearFiltersButton);

    // Wait for filters to be cleared (optional: add a wait condition)
    await this.page.waitForTimeout(1000);
  }

  async switchToJQL() {
    // Click the "Switch to JQL" button/link
    await this.page.click(this.switchToJQLButton);

    // Wait for JQL input field to be visible
    await this.page.waitForSelector(this.jqlInputField, { timeout: 10000 });
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
    await this.page.waitForSelector(this.filtersPageHeader, { timeout: 10000 });
  }
}

module.exports = { FiltersPage };
