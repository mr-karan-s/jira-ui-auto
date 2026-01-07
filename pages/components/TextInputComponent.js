/**
 * TextInputComponent
 * 
 * Handles text input field interactions including:
 * - Getting input values
 * - Validating input content
 * - Text extraction and validation
 */
class TextInputComponent {
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
   * Get the current value of the input field
   * @returns {Promise<string>} Current input value
   */
  async getValue() {
    return await this.page.locator(this.inputLocator).inputValue();
  }

  /**
   * Check if input field contains a specific value
   * @param {string} expectedValue - Value to check for
   * @returns {Promise<boolean>} True if input contains the value
   */
  async containsValue(expectedValue) {
    const value = await this.getValue();
    return value.includes(expectedValue);
  }

  /**
   * Check if input field equals a specific value (exact match)
   * @param {string} expectedValue - Value to match
   * @returns {Promise<boolean>} True if input equals the value
   */
  async equalsValue(expectedValue) {
    const value = await this.getValue();
    return value === expectedValue;
  }

  /**
   * Get the text content (innerText) of the input field
   * @returns {Promise<string>} Text content
   */
  async getTextContent() {
    return await this.page.locator(this.inputLocator).innerText();
  }

  /**
   * Check if input field is empty
   * @returns {Promise<boolean>} True if input is empty
   */
  async isEmpty() {
    const value = await this.getValue();
    return value.trim().length === 0;
  }

  /**
   * Get the length of input value
   * @returns {Promise<number>} Length of input value
   */
  async getValueLength() {
    const value = await this.getValue();
    return value.length;
  }

  /**
   * Check if input value starts with a specific text
   * @param {string} prefix - Text to check
   * @returns {Promise<boolean>} True if value starts with prefix
   */
  async startsWithValue(prefix) {
    const value = await this.getValue();
    return value.startsWith(prefix);
  }

  /**
   * Check if input value ends with a specific text
   * @param {string} suffix - Text to check
   * @returns {Promise<boolean>} True if value ends with suffix
   */
  async endsWithValue(suffix) {
    const value = await this.getValue();
    return value.endsWith(suffix);
  }

  /**
   * Get input field type attribute
   * @returns {Promise<string>} Input type (e.g., 'text', 'password', 'email')
   */
  async getType() {
    return await this.page.locator(this.inputLocator).getAttribute('type');
  }

  /**
   * Check if input exists
   * @returns {Promise<boolean>} True if input exists
   */
  async exists() {
    const count = await this.page.locator(this.inputLocator).count();
    return count > 0;
  }

  /**
   * Check if input is visible
   * @returns {Promise<boolean>} True if input is visible
   */
  async isVisible() {
    return await this.page.locator(this.inputLocator).isVisible();
  }

  /**
   * Check if input is enabled
   * @returns {Promise<boolean>} True if input is enabled
   */
  async isEnabled() {
    return await this.page.locator(this.inputLocator).isEnabled();
  }

  /**
   * Check if input is read-only
   * @returns {Promise<boolean>} True if input is read-only
   */
  async isReadOnly() {
    return await this.page.locator(this.inputLocator).getAttribute('readonly') !== null;
  }

  /**
   * Get input placeholder text
   * @returns {Promise<string>} Placeholder text
   */
  async getPlaceholder() {
    return await this.page.locator(this.inputLocator).getAttribute('placeholder');
  }

  /**
   * Validate value matches a regex pattern
   * @param {RegExp} pattern - Regex pattern to match
   * @returns {Promise<boolean>} True if value matches pattern
   */
  async matchesPattern(pattern) {
    const value = await this.getValue();
    return pattern.test(value);
  }
}

module.exports = TextInputComponent;
