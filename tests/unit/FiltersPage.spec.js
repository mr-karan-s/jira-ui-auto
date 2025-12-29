const { test, expect } = require('@playwright/test');
const { FiltersPage } = require('../../pages/FiltersPage');
const { ALLOWED_STATUSES, OPEN_STATUSES, CLOSED_STATUSES } = require('../../utils/constants');

// Mock Playwright page object for unit testing
const createMockPage = () => ({
  waitForSelector: async () => {},
  click: async () => {},
  locator: (selector) => ({
    count: async () => 1,
    nth: (index) => ({
      innerText: async () => 'Open',
    }),
    inputValue: async () => 'status = "Open"',
    check: async () => {},
  }),
  keyboard: {
    press: async () => {},
  },
  waitForTimeout: async () => {},
});

test.describe('FiltersPage - Initialization', () => {
  test('FiltersPage should initialize with valid locators', () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    expect(filtersPage.filtersPageHeader).toBeDefined();
    expect(filtersPage.createFilterButton).toBeDefined();
    expect(filtersPage.statusColumn).toBeDefined();
    expect(filtersPage.statusDropdown).toBeDefined();
    expect(filtersPage.clearFiltersButton).toBeDefined();
    expect(filtersPage.switchToJQLButton).toBeDefined();
    expect(filtersPage.jqlInputField).toBeDefined();
    expect(filtersPage.switchToBasicButton).toBeDefined();
  });

  test('All locators should be non-empty strings', () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    const locators = [
      filtersPage.filtersPageHeader,
      filtersPage.createFilterButton,
      filtersPage.statusColumn,
      filtersPage.statusDropdown,
      filtersPage.clearFiltersButton,
      filtersPage.switchToJQLButton,
      filtersPage.jqlInputField,
      filtersPage.switchToBasicButton,
    ];

    locators.forEach((locator) => {
      expect(typeof locator).toBe('string');
      expect(locator.trim().length).toBeGreaterThan(0);
    });
  });

  test('FiltersPage should have constants loaded', () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    expect(filtersPage.constants).toBeDefined();
    expect(filtersPage.constants.ALLOWED_STATUSES).toBeDefined();
    expect(filtersPage.constants.TIMEOUTS).toBeDefined();
  });
});

test.describe('FiltersPage - selectStatusFilters() Input Validation', () => {
  test('should throw error if no statuses provided', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters([])).rejects.toThrow(
      'At least one status must be provided'
    );
  });

  test('should throw error if statuses is not an array', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters('Open')).rejects.toThrow(
      'At least one status must be provided'
    );
  });

  test('should throw error if invalid status provided', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters(['InvalidStatus'])).rejects.toThrow(
      'Invalid status values'
    );
  });

  test('should throw error if mix of valid and invalid statuses provided', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters(['Open', 'InvalidStatus'])).rejects.toThrow(
      'Invalid status values'
    );
  });

  test('should accept all valid OPEN statuses', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    // Should not throw
    await expect(filtersPage.selectStatusFilters(OPEN_STATUSES)).resolves.not.toThrow();
  });

  test('should accept all valid CLOSED statuses', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    // Should not throw
    await expect(filtersPage.selectStatusFilters(CLOSED_STATUSES)).resolves.not.toThrow();
  });

  test('should accept single valid status', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    // Should not throw
    await expect(filtersPage.selectStatusFilters(['Open'])).resolves.not.toThrow();
  });

  test('should accept all ALLOWED_STATUSES', async () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    // Should not throw
    await expect(filtersPage.selectStatusFilters(ALLOWED_STATUSES)).resolves.not.toThrow();
  });
});

test.describe('FiltersPage - Method Existence', () => {
  test('FiltersPage should have all required methods', () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    expect(typeof filtersPage.waitForFiltersPageToLoad).toBe('function');
    expect(typeof filtersPage.clickCreateFilter).toBe('function');
    expect(typeof filtersPage.validateStatusesInResults).toBe('function');
    expect(typeof filtersPage.selectStatusFilters).toBe('function');
    expect(typeof filtersPage.clearAllFilters).toBe('function');
    expect(typeof filtersPage.switchToJQL).toBe('function');
    expect(typeof filtersPage.getJQLQueryText).toBe('function');
    expect(typeof filtersPage.switchToBasic).toBe('function');
  });
});

test.describe('FiltersPage - Timeout Configuration', () => {
  test('should use TIMEOUTS from constants', () => {
    const mockPage = createMockPage();
    const filtersPage = new FiltersPage(mockPage);

    expect(filtersPage.constants.TIMEOUTS.PAGE_LOAD).toBe(30000);
    expect(filtersPage.constants.TIMEOUTS.DROPDOWN_OPEN).toBe(10000);
    expect(filtersPage.constants.TIMEOUTS.QUICK_ACTION).toBe(5000);
    expect(filtersPage.constants.TIMEOUTS.FILTER_CLEAR).toBe(1000);
  });
});
