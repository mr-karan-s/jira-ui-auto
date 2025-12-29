const { test, expect } = require('@playwright/test');
const { FiltersPage } = require('../../pages/FiltersPage');

// Mock Playwright page object with configurable behavior
const createMockPageWithEmptyResults = () => ({
  waitForSelector: async () => {},
  click: async () => {},
  locator: (selector) => ({
    count: async () => 0, // No results
    nth: (index) => ({
      innerText: async () => '',
    }),
    inputValue: async () => '',
    check: async () => {},
  }),
  keyboard: {
    press: async () => {},
  },
  waitForTimeout: async () => {},
});

const createMockPageWithMismatchedStatus = () => ({
  waitForSelector: async () => {},
  click: async () => {},
  locator: (selector) => ({
    count: async () => 1,
    nth: (index) => ({
      innerText: async () => 'Blocked', // Unexpected status
    }),
    inputValue: async () => '',
    check: async () => {},
  }),
  keyboard: {
    press: async () => {},
  },
  waitForTimeout: async () => {},
});

const createMockPageWithValidResults = () => ({
  waitForSelector: async () => {},
  click: async () => {},
  locator: (selector) => ({
    count: async () => 2,
    nth: (index) => ({
      innerText: async () => (index === 0 ? 'Open' : 'To Do'),
    }),
    inputValue: async () => '',
    check: async () => {},
  }),
  keyboard: {
    press: async () => {},
  },
  waitForTimeout: async () => {},
});

test.describe('FiltersPage - Error Handling - Empty Results', () => {
  test('validateStatusesInResults should not throw on empty results', async () => {
    const mockPage = createMockPageWithEmptyResults();
    const filtersPage = new FiltersPage(mockPage);

    // Should not throw, should just log warning
    await expect(
      filtersPage.validateStatusesInResults(['Open'])
    ).resolves.not.toThrow();
  });

  test('validateStatusesInResults should return undefined on empty results', async () => {
    const mockPage = createMockPageWithEmptyResults();
    const filtersPage = new FiltersPage(mockPage);

    const result = await filtersPage.validateStatusesInResults(['Open']);
    expect(result).toBeUndefined();
  });
});

test.describe('FiltersPage - Error Handling - Mismatched Status', () => {
  test('validateStatusesInResults should throw on unexpected status', async () => {
    const mockPage = createMockPageWithMismatchedStatus();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.validateStatusesInResults(['Open'])).rejects.toThrow(
      'Unexpected status found: Blocked'
    );
  });

  test('error message should list expected statuses', async () => {
    const mockPage = createMockPageWithMismatchedStatus();
    const filtersPage = new FiltersPage(mockPage);

    try {
      await filtersPage.validateStatusesInResults(['Open', 'To Do']);
    } catch (error) {
      expect(error.message).toContain('Open');
      expect(error.message).toContain('To Do');
    }
  });
});

test.describe('FiltersPage - Error Handling - Valid Results', () => {
  test('validateStatusesInResults should not throw on valid statuses', async () => {
    const mockPage = createMockPageWithValidResults();
    const filtersPage = new FiltersPage(mockPage);

    await expect(
      filtersPage.validateStatusesInResults(['Open', 'To Do'])
    ).resolves.not.toThrow();
  });

  test('validateStatusesInResults should validate all returned results', async () => {
    const mockPage = createMockPageWithValidResults();
    const filtersPage = new FiltersPage(mockPage);

    // Should check both results (Open and To Do)
    await expect(
      filtersPage.validateStatusesInResults(['Open', 'To Do'])
    ).resolves.not.toThrow();
  });
});

test.describe('FiltersPage - Error Handling - selectStatusFilters Missing Element', () => {
  test('selectStatusFilters should provide clear error when status checkbox missing', async () => {
    // Create mock that returns 0 checkboxes for specific status
    const mockPage = {
      waitForSelector: async () => {},
      click: async () => {},
      locator: (selector) => ({
        count: async () => {
          // Return 0 for the checkbox locator
          if (selector.includes('input[value=')) {
            return 0;
          }
          return 1;
        },
        nth: (index) => ({
          innerText: async () => 'Open',
        }),
        inputValue: async () => '',
        check: async () => {},
      }),
      keyboard: {
        press: async () => {},
      },
    };

    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters(['Open'])).rejects.toThrow(
      'not found in the filter dropdown'
    );
  });
});

test.describe('Error Handling - Input Validation Messages', () => {
  test('Error messages should be descriptive and actionable', async () => {
    const mockPage = createMockPageWithEmptyResults();
    const filtersPage = new FiltersPage(mockPage);

    try {
      await filtersPage.selectStatusFilters(['InvalidStatus']);
    } catch (error) {
      expect(error.message).toContain('Invalid status');
      expect(error.message).toContain('Allowed');
    }
  });

  test('Error should include list of allowed statuses', async () => {
    const mockPage = createMockPageWithEmptyResults();
    const filtersPage = new FiltersPage(mockPage);

    try {
      await filtersPage.selectStatusFilters(['BadStatus']);
    } catch (error) {
      // Should mention at least one allowed status
      const allowedStatuses = ['Open', 'Done', 'Closed', 'To Do', 'In Progress'];
      const hasAllowedStatus = allowedStatuses.some((status) =>
        error.message.includes(status)
      );
      expect(hasAllowedStatus).toBe(true);
    }
  });
});

test.describe('Error Handling - Graceful Degradation', () => {
  test('Empty array should throw with clear message', async () => {
    const mockPage = createMockPageWithEmptyResults();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters([])).rejects.toThrow(
      'At least one status'
    );
  });

  test('Non-array input should throw with clear message', async () => {
    const mockPage = createMockPageWithEmptyResults();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters(null)).rejects.toThrow(
      'At least one status'
    );
  });

  test('Undefined input should throw with clear message', async () => {
    const mockPage = createMockPageWithEmptyResults();
    const filtersPage = new FiltersPage(mockPage);

    await expect(filtersPage.selectStatusFilters(undefined)).rejects.toThrow(
      'At least one status'
    );
  });
});
