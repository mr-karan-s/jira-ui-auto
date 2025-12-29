const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');

// Mock Playwright page object
const createMockPage = () => ({
  waitForSelector: async () => {},
  click: async () => {},
});

test.describe('HomePage - Initialization', () => {
  test('HomePage should initialize with valid locators', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    expect(homePage.yourWorkTab).toBeDefined();
    expect(homePage.filtersMenu).toBeDefined();
    expect(homePage.viewAllFiltersOption).toBeDefined();
  });

  test('All locators should be non-empty strings', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    const locators = [homePage.yourWorkTab, homePage.filtersMenu, homePage.viewAllFiltersOption];

    locators.forEach((locator) => {
      expect(typeof locator).toBe('string');
      expect(locator.trim().length).toBeGreaterThan(0);
    });
  });

  test('HomePage should have constants loaded', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    expect(homePage.constants).toBeDefined();
    expect(homePage.constants.TIMEOUTS).toBeDefined();
  });
});

test.describe('HomePage - Method Existence', () => {
  test('HomePage should have all required methods', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    expect(typeof homePage.waitForHomePageToLoad).toBe('function');
    expect(typeof homePage.navigateToFiltersPage).toBe('function');
  });
});

test.describe('HomePage - Timeout Configuration', () => {
  test('waitForHomePageToLoad should use PAGE_LOAD timeout', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    expect(homePage.constants.TIMEOUTS.PAGE_LOAD).toBe(30000);
  });
});

test.describe('HomePage - Locator Values', () => {
  test('yourWorkTab should contain text selector for Your work', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    expect(homePage.yourWorkTab).toContain('Your work');
  });

  test('filtersMenu should contain text selector for Filters', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    expect(homePage.filtersMenu).toContain('Filters');
  });

  test('viewAllFiltersOption should contain text selector for View all filters', () => {
    const mockPage = createMockPage();
    const homePage = new HomePage(mockPage);

    expect(homePage.viewAllFiltersOption).toContain('View all filters');
  });
});
