/**
 * TableComponent
 * 
 * Handles table/results interactions including:
 * - Getting row/cell data
 * - Validating cell contents
 * - Counting rows
 * - Extracting table data
 */
class TableComponent {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   * @param {string} cellLocator - Locator for table cells (e.g., '[data-testid="issue.status"]')
   */
  constructor(page, cellLocator) {
    this.page = page;
    this.cellLocator = cellLocator;
  }

  /**
   * Get the number of rows in the table
   * @returns {Promise<number>} Number of rows
   */
  async getRowCount() {
    return await this.page.locator(this.cellLocator).count();
  }

  /**
   * Get text content of a specific row/cell
   * @param {number} index - Index of the row (0-based)
   * @returns {Promise<string>} Text content of the cell
   */
  async getRowText(index) {
    const count = await this.getRowCount();
    if (index >= count) {
      throw new Error(`Row index ${index} out of bounds. Total rows: ${count}`);
    }
    return await this.page.locator(this.cellLocator).nth(index).innerText();
  }

  /**
   * Get all row texts from the table
   * @returns {Promise<string[]>} Array of all row texts
   */
  async getAllRowTexts() {
    const count = await this.getRowCount();
    const texts = [];
    for (let i = 0; i < count; i++) {
      texts.push(await this.getRowText(i));
    }
    return texts;
  }

  /**
   * Validate that all cells contain values from an expected list
   * @param {string[]} expectedValues - Array of values that cells should contain
   */
  async validateAllCellsContainExpectedValues(expectedValues) {
    const count = await this.getRowCount();

    if (count === 0) {
      console.warn('No rows found in table');
      return;
    }

    for (let i = 0; i < count; i++) {
      const cellText = await this.getRowText(i);

      if (!expectedValues.includes(cellText)) {
        throw new Error(
          `Unexpected value found: "${cellText}". Expected one of: ${expectedValues.join(', ')}`
        );
      }
    }
  }

  /**
   * Check if table is empty
   * @returns {Promise<boolean>} True if table has no rows
   */
  async isEmpty() {
    const count = await this.getRowCount();
    return count === 0;
  }

  /**
   * Find row index by text content
   * @param {string} searchText - Text to search for
   * @returns {Promise<number>} Index of the row, or -1 if not found
   */
  async findRowByText(searchText) {
    const texts = await this.getAllRowTexts();
    return texts.indexOf(searchText);
  }

  /**
   * Check if a specific value exists in the table
   * @param {string} searchValue - Value to search for
   * @returns {Promise<boolean>} True if value found
   */
  async valueExists(searchValue) {
    const texts = await this.getAllRowTexts();
    return texts.includes(searchValue);
  }

  /**
   * Get first row text
   * @returns {Promise<string>} Text of first row
   */
  async getFirstRowText() {
    const count = await this.getRowCount();
    if (count === 0) {
      throw new Error('No rows in table');
    }
    return await this.getRowText(0);
  }

  /**
   * Get last row text
   * @returns {Promise<string>} Text of last row
   */
  async getLastRowText() {
    const count = await this.getRowCount();
    if (count === 0) {
      throw new Error('No rows in table');
    }
    return await this.getRowText(count - 1);
  }
}

module.exports = TableComponent;
