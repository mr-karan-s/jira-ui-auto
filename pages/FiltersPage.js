const BasePage = require('./BasePage');
const DropdownComponent = require('./components/DropdownComponent');
const CheckboxComponent = require('./components/CheckboxComponent');
const TableComponent = require('./components/TableComponent');
const NavigationComponent = require('./components/NavigationComponent');
const TextInputComponent = require('./components/TextInputComponent');

class FiltersPage extends BasePage {
  constructor(page) {
    super(page);

    // Initialize components
    this.statusDropdown = new DropdownComponent(
      page,
      '[data-testid="status.ui.filter.dropdown"]',
      '[role="listbox"]'
    );
    this.statusTable = new TableComponent(page, '[data-testid="issue.status"]');
    this.createFilterButton = new NavigationComponent(
      page,
      'text=Create filter'
    );
    this.clearFiltersButton = new NavigationComponent(page, 'text=Clear');
    this.switchToJQLButton = new NavigationComponent(
      page,
      'text=Switch to JQL',
      'input[data-testid="jql.input"]'
    );
    this.switchToBasicButton = new NavigationComponent(
      page,
      'text=Switch to basic',
      'text=Filters'
    );
    this.jqlInput = new TextInputComponent(page, 'input[data-testid="jql.input"]');

    // Page header locator for validation
    this.filtersPageHeader = 'text=Filters';
  }

  async waitForFiltersPageToLoad() {
    // Confirms navigation to Filters page
    await this.waitForElement(this.filtersPageHeader);
  }

  async clickCreateFilter() {
    await this.createFilterButton.click();
  }

  async selectStatusFilters(statuses) {
    // Open status dropdown
    await this.statusDropdown.open();

    // Select each status checkbox
    for (const status of statuses) {
      const statusCheckbox = new CheckboxComponent(this.page, `input[value="${status}"]`);
      await statusCheckbox.check();
    }

    // Close dropdown
    await this.statusDropdown.close();
  }

  async getResultStatuses() {
    // Retrieve all status values from results table
    return await this.statusTable.getAllRowTexts();
  }

  async clearAllFilters() {
    // Click the clear filters button
    await this.clearFiltersButton.click();

    // Wait for filters to be cleared
    await this.wait(this.constants.TIMEOUTS.FILTER_CLEAR);
  }

  async switchToJQL() {
    // Click "Switch to JQL" button and wait for JQL input to appear
    await this.switchToJQLButton.clickAndWaitForTarget();
  }

  async getJQLQueryText() {
    // Get the text/value from the JQL input field
    return await this.jqlInput.getValue();
  }

  async switchToBasic() {
    // Click "Switch to basic" button and wait for filters page header to appear
    await this.switchToBasicButton.clickAndWaitForTarget();
  }
}

module.exports = { FiltersPage };
