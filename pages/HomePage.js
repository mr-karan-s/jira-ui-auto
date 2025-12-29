class HomePage {
  constructor(page) {
    this.page = page;
    this.constants = require('../utils/constants');

    // Locators for homepage validation
    this.yourWorkTab = 'text=Your work';

    // Locators for top navigation
    this.filtersMenu = 'text=Filters';
    this.viewAllFiltersOption = 'text=View all filters';
  }

  async waitForHomePageToLoad() {
    // Confirms login was successful
    await this.page.waitForSelector(this.yourWorkTab, {
      timeout: this.constants.TIMEOUTS.PAGE_LOAD,
    });
  }

  async navigateToFiltersPage() {
    // Click Filters in top navigation
    await this.page.click(this.filtersMenu);

    // Click "View all filters" from dropdown
    await this.page.click(this.viewAllFiltersOption);
  }
}

module.exports = { HomePage };
