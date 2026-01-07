const BasePage = require('./BasePage');
const NavigationComponent = require('./components/NavigationComponent');
const DropdownComponent = require('./components/DropdownComponent');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Initialize components
    this.yourWorkTab = new NavigationComponent(page, 'text=Your work');
    this.filtersMenu = new DropdownComponent(page, 'text=Filters');
  }

  async waitForHomePageToLoad() {
    // Confirms login was successful
    await this.waitForElement('text=Your work');
  }

  async navigateToFiltersPage() {
    // Click Filters in top navigation and select "View all filters"
    await this.filtersMenu.selectOption('View all filters');
  }
}

module.exports = { HomePage };
