class FiltersPage {
  constructor(page) {
    this.page = page;

    // Locator that confirms Filters page is loaded
    this.filtersPageHeader = 'text=Filters';

    // Locator for Create filter button
    this.createFilterButton = 'text=Create filter';

    // Locator for Status column in results table
    this.statusColumn = '[data-testid="issue.status"]';
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
}

module.exports = { FiltersPage };
