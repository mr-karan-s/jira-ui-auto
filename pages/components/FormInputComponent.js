/**
 * FormInputComponent
 * 
 * Handles form input field interactions including:
 * - Filling input fields
 * - Getting input values
 * - Clearing inputs
 * - Validating input state
 */
class FormInputComponent {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   * @param {string} inputLocator - Locator for the input field
   */
  constructor(page, inputLocator) {
    this.page = page;
    this.inputLocator = inputLocator;
  }

  /**
   * Fill the input field with text
   * @param {string} value - Text to fill
   */
  async fill(value) {
    if (!value) {
      throw new Error('Input value cannot be empty');
    }
    await this.page.fill(this.inputLocator, value);
  }

  /**
   * Get the current value of the input field
   * @returns {Promise<string>} Current input value
   */
  async getValue() {
    return await this.page.locator(this.inputLocator).inputValue();
  }

  /**
   * Clear the input field
   */
  async clear() {
    await this.page.fill(this.inputLocator, '');
  }

  /**
   * Clear and fill the input with new value
   * @param {string} value - New value to fill
   */
  async clearAndFill(value) {
    await this.clear();
    await this.fill(value);
  }

  /**
   * Check if input field exists
   * @returns {Promise<boolean>} True if input exists
   */
  async exists() {
    const count = await this.page.locator(this.inputLocator).count();
    return count > 0;
  }

  /**
   * Check if input field is visible
   * @returns {Promise<boolean>} True if input is visible
   */
  async isVisible() {
    return await this.page.locator(this.inputLocator).isVisible();
  }

  /**
   * Check if input field is enabled
   * @returns {Promise<boolean>} True if input is enabled
   */
  async isEnabled() {
    return await this.page.locator(this.inputLocator).isEnabled();
  }

  /**
   * Get the placeholder text of input
   * @returns {Promise<string>} Placeholder text
   */
  async getPlaceholder() {
    return await this.page.locator(this.inputLocator).getAttribute('placeholder');
  }

  /**
   * Type text character by character (slower, more realistic)
   * @param {string} value - Text to type
   */
  async type(value) {
    await this.page.locator(this.inputLocator).type(value);
  }

  /**
   * Focus on the input field
   */
  async focus() {
    await this.page.locator(this.inputLocator).focus();
  }

  /**
   * Blur (unfocus) from the input field
   */
  async blur() {
    await this.page.locator(this.inputLocator).blur();
  }
}

module.exports = FormInputComponent;
