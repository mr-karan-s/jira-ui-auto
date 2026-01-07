/**
 * NavigationComponent
 * 
 * Handles navigation button/tab interactions including:
 * - Clicking navigation elements
 * - Validating navigation state
 * - Tab selection
 * - Menu interactions
 */
class NavigationComponent {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   * @param {string} elementLocator - Locator for the navigation element (button, tab, link)
   * @param {string} targetElementLocator - Locator for element that appears after navigation (optional)
   */
  constructor(page, elementLocator, targetElementLocator = null) {
    this.page = page;
    this.elementLocator = elementLocator;
    this.targetElementLocator = targetElementLocator;
    this.constants = require('../../utils/constants');
  }

  /**
   * Click the navigation element
   */
  async click() {
    await this.page.click(this.elementLocator);
  }

  /**
   * Click and wait for target element to appear
   */
  async clickAndWaitForTarget() {
    if (!this.targetElementLocator) {
      throw new Error('Target element locator not set. Cannot wait for target.');
    }
    await this.click();
    await this.page.waitForSelector(this.targetElementLocator, {
      timeout: this.constants.TIMEOUTS.QUICK_ACTION,
    });
  }

  /**
   * Check if navigation element exists
   * @returns {Promise<boolean>} True if element exists
   */
  async exists() {
    const count = await this.page.locator(this.elementLocator).count();
    return count > 0;
  }

  /**
   * Check if navigation element is visible
   * @returns {Promise<boolean>} True if element is visible
   */
  async isVisible() {
    return await this.page.locator(this.elementLocator).isVisible();
  }

  /**
   * Check if navigation element is enabled/clickable
   * @returns {Promise<boolean>} True if element is enabled
   */
  async isEnabled() {
    return await this.page.locator(this.elementLocator).isEnabled();
  }

  /**
   * Get text content of navigation element
   * @returns {Promise<string>} Element text
   */
  async getText() {
    return await this.page.locator(this.elementLocator).innerText();
  }

  /**
   * Check if target element is visible after navigation
   * @returns {Promise<boolean>} True if target is visible
   */
  async isTargetVisible() {
    if (!this.targetElementLocator) {
      throw new Error('Target element locator not set.');
    }
    try {
      return await this.page.locator(this.targetElementLocator).isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  /**
   * Wait for navigation element to be clickable
   */
  async waitForClickable() {
    await this.page.locator(this.elementLocator).waitFor({ state: 'visible' });
  }

  /**
   * Click with validation
   */
  async clickWithValidation() {
    if (!(await this.exists())) {
      throw new Error(`Navigation element not found: ${this.elementLocator}`);
    }
    if (!(await this.isVisible())) {
      throw new Error(`Navigation element not visible: ${this.elementLocator}`);
    }
    await this.click();
  }

  /**
   * Get the CSS class of the element
   * @returns {Promise<string>} CSS classes
   */
  async getClass() {
    return await this.page.locator(this.elementLocator).getAttribute('class');
  }

  /**
   * Check if element has a specific CSS class
   * @param {string} className - Class name to check
   * @returns {Promise<boolean>} True if element has the class
   */
  async hasClass(className) {
    const classes = await this.getClass();
    return classes && classes.includes(className);
  }

  /**
   * Check if element is active/selected
   * @param {string} activeClass - CSS class that indicates active state (default: 'active')
   * @returns {Promise<boolean>} True if element is active
   */
  async isActive(activeClass = 'active') {
    return await this.hasClass(activeClass);
  }
}

module.exports = NavigationComponent;
