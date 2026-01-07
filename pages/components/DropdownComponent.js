/**
 * DropdownComponent
 * 
 * Handles dropdown menu interactions including:
 * - Opening/closing dropdowns
 * - Selecting options
 * - Validating dropdown state
 */
class DropdownComponent {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   * @param {string} dropdownLocator - Locator for the dropdown trigger
   * @param {string} optionsLocator - Locator for dropdown options container (default: '[role="listbox"]')
   */
  constructor(page, dropdownLocator, optionsLocator = '[role="listbox"]') {
    this.page = page;
    this.dropdownLocator = dropdownLocator;
    this.optionsLocator = optionsLocator;
    this.constants = require('../../utils/constants');
  }

  /**
   * Open the dropdown menu
   */
  async open() {
    await this.page.click(this.dropdownLocator);
    await this.page.waitForSelector(this.optionsLocator, {
      timeout: this.constants.TIMEOUTS.DROPDOWN_OPEN,
    });
  }

  /**
   * Close the dropdown menu
   */
  async close() {
    await this.page.keyboard.press('Escape');
  }

  /**
   * Select an option from the dropdown by text
   * @param {string} optionText - Text of the option to select
   */
  async selectOption(optionText) {
    // Open dropdown
    await this.open();

    // Find and click the option
    const option = this.page.locator(`text=${optionText}`);
    const count = await option.count();
    if (count === 0) {
      throw new Error(`Option "${optionText}" not found in dropdown`);
    }

    await option.click();
  }

  /**
   * Select an option by value attribute
   * @param {string} optionValue - Value attribute of the option to select
   */
  async selectOptionByValue(optionValue) {
    // Open dropdown
    await this.open();

    // Find and click the option
    const option = this.page.locator(`[value="${optionValue}"]`);
    const count = await option.count();
    if (count === 0) {
      throw new Error(`Option with value "${optionValue}" not found in dropdown`);
    }

    await option.click();
  }

  /**
   * Check if an option exists in the dropdown
   * @param {string} optionText - Text of the option to check
   * @returns {Promise<boolean>} True if option exists
   */
  async optionExists(optionText) {
    await this.open();
    const option = this.page.locator(`text=${optionText}`);
    const exists = (await option.count()) > 0;
    await this.close();
    return exists;
  }

  /**
   * Get all option texts from dropdown
   * @returns {Promise<string[]>} Array of option texts
   */
  async getAllOptions() {
    await this.open();
    const options = await this.page.locator(`${this.optionsLocator} >> text=*`).allTextContents();
    await this.close();
    return options;
  }

  /**
   * Get count of available options
   * @returns {Promise<number>} Number of options
   */
  async getOptionCount() {
    await this.open();
    const count = await this.page.locator(this.optionsLocator).count();
    await this.close();
    return count;
  }

  /**
   * Check if dropdown is open
   * @returns {Promise<boolean>} True if dropdown is open
   */
  async isOpen() {
    try {
      await this.page.waitForSelector(this.optionsLocator, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = DropdownComponent;
