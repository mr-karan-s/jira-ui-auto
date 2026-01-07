/**
 * BasePage
 * 
 * Base class for all page objects. Provides common helper methods to avoid
 * duplication of page interaction patterns across different page classes.
 * 
 * All page classes should inherit from BasePage instead of directly using
 * Playwright's page object.
 */
class BasePage {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;
    this.constants = require('../utils/constants');
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to
   */
  async navigate(url) {
    await this.page.goto(url);
  }

  /**
   * Click an element by locator
   * @param {string} locator - CSS selector or Playwright locator
   */
  async click(locator) {
    await this.page.click(locator);
  }

  /**
   * Fill an input field with text
   * @param {string} locator - CSS selector or Playwright locator
   * @param {string} text - Text to fill
   */
  async fill(locator, text) {
    await this.page.fill(locator, text);
  }

  /**
   * Get text content of an element
   * @param {string} locator - CSS selector or Playwright locator
   * @returns {Promise<string>} Text content
   */
  async getText(locator) {
    return await this.page.locator(locator).innerText();
  }

  /**
   * Wait for an element to appear in the DOM
   * @param {string} locator - CSS selector or Playwright locator
   * @param {number} timeout - Timeout in milliseconds (optional, defaults to PAGE_LOAD)
   */
  async waitForElement(locator, timeout = this.constants.TIMEOUTS.PAGE_LOAD) {
    await this.page.waitForSelector(locator, { timeout });
  }

  /**
   * Check if an element exists in the DOM
   * @param {string} locator - CSS selector or Playwright locator
   * @returns {Promise<boolean>} True if element exists, false otherwise
   */
  async elementExists(locator) {
    const count = await this.page.locator(locator).count();
    return count > 0;
  }

  /**
   * Get the value of an input element
   * @param {string} locator - CSS selector or Playwright locator
   * @returns {Promise<string>} Input value
   */
  async getInputValue(locator) {
    return await this.page.locator(locator).inputValue();
  }

  /**
   * Press a keyboard key
   * @param {string} key - Key to press (e.g., 'Enter', 'Escape', 'Tab')
   */
  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for navigation to complete
   * @param {string} urlPattern - URL pattern to wait for (e.g., '**/jira/**')
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForNavigation(urlPattern, timeout = this.constants.TIMEOUTS.PAGE_LOAD) {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Get count of elements matching locator
   * @param {string} locator - CSS selector or Playwright locator
   * @returns {Promise<number>} Number of matching elements
   */
  async getElementCount(locator) {
    return await this.page.locator(locator).count();
  }

  /**
   * Check an input checkbox
   * @param {string} locator - CSS selector or Playwright locator
   */
  async check(locator) {
    await this.page.locator(locator).check();
  }

  /**
   * Uncheck an input checkbox
   * @param {string} locator - CSS selector or Playwright locator
   */
  async uncheck(locator) {
    await this.page.locator(locator).uncheck();
  }

  /**
   * Wait for a specified time (in milliseconds)
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Get inner text of element at index
   * @param {string} locator - CSS selector or Playwright locator
   * @param {number} index - Index of element
   * @returns {Promise<string>} Inner text of the element
   */
  async getTextAtIndex(locator, index) {
    return await this.page.locator(locator).nth(index).innerText();
  }
}

module.exports = BasePage;
