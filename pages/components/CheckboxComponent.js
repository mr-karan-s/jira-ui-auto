/**
 * CheckboxComponent
 * 
 * Handles checkbox interactions including:
 * - Checking/unchecking
 * - Getting checkbox state
 * - Validating checkbox state
 * - Batch operations
 */
class CheckboxComponent {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   * @param {string} checkboxLocator - Locator for the checkbox
   */
  constructor(page, checkboxLocator) {
    this.page = page;
    this.checkboxLocator = checkboxLocator;
  }

  /**
   * Check the checkbox
   */
  async check() {
    await this.page.locator(this.checkboxLocator).check();
  }

  /**
   * Uncheck the checkbox
   */
  async uncheck() {
    await this.page.locator(this.checkboxLocator).uncheck();
  }

  /**
   * Toggle checkbox state (check if unchecked, uncheck if checked)
   */
  async toggle() {
    const isChecked = await this.isChecked();
    if (isChecked) {
      await this.uncheck();
    } else {
      await this.check();
    }
  }

  /**
   * Check if checkbox is checked
   * @returns {Promise<boolean>} True if checkbox is checked
   */
  async isChecked() {
    return await this.page.locator(this.checkboxLocator).isChecked();
  }

  /**
   * Check if checkbox exists
   * @returns {Promise<boolean>} True if checkbox exists
   */
  async exists() {
    const count = await this.page.locator(this.checkboxLocator).count();
    return count > 0;
  }

  /**
   * Check if checkbox is visible
   * @returns {Promise<boolean>} True if checkbox is visible
   */
  async isVisible() {
    return await this.page.locator(this.checkboxLocator).isVisible();
  }

  /**
   * Check if checkbox is enabled
   * @returns {Promise<boolean>} True if checkbox is enabled
   */
  async isEnabled() {
    return await this.page.locator(this.checkboxLocator).isEnabled();
  }

  /**
   * Get checkbox value attribute
   * @returns {Promise<string>} Checkbox value
   */
  async getValue() {
    return await this.page.locator(this.checkboxLocator).getAttribute('value');
  }

  /**
   * Get checkbox name attribute
   * @returns {Promise<string>} Checkbox name
   */
  async getName() {
    return await this.page.locator(this.checkboxLocator).getAttribute('name');
  }

  /**
   * Check if exists and is visible before interacting
   */
  async validateBeforeInteraction() {
    if (!(await this.exists())) {
      throw new Error(`Checkbox not found with locator: ${this.checkboxLocator}`);
    }
    if (!(await this.isVisible())) {
      throw new Error(`Checkbox is not visible: ${this.checkboxLocator}`);
    }
    if (!(await this.isEnabled())) {
      throw new Error(`Checkbox is not enabled: ${this.checkboxLocator}`);
    }
  }

  /**
   * Check with validation
   */
  async checkWithValidation() {
    await this.validateBeforeInteraction();
    await this.check();
  }

  /**
   * Uncheck with validation
   */
  async uncheckWithValidation() {
    await this.validateBeforeInteraction();
    await this.uncheck();
  }
}

module.exports = CheckboxComponent;
