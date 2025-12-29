const { test, expect } = require('@playwright/test');
const {
  OPEN_STATUSES,
  CLOSED_STATUSES,
  ALLOWED_STATUSES,
  OPEN_STATUSES_JQL_PATTERN,
  CLOSED_STATUSES_JQL_PATTERN,
  TIMEOUTS,
} = require('../../utils/constants');

test.describe('Constants - Status Values', () => {
  test('OPEN_STATUSES should not be empty', () => {
    expect(OPEN_STATUSES.length).toBeGreaterThan(0);
  });

  test('CLOSED_STATUSES should not be empty', () => {
    expect(CLOSED_STATUSES.length).toBeGreaterThan(0);
  });

  test('ALLOWED_STATUSES should include all OPEN and CLOSED statuses', () => {
    const openInAllowed = OPEN_STATUSES.every((status) =>
      ALLOWED_STATUSES.includes(status)
    );
    const closedInAllowed = CLOSED_STATUSES.every((status) =>
      ALLOWED_STATUSES.includes(status)
    );

    expect(openInAllowed).toBe(true);
    expect(closedInAllowed).toBe(true);
  });

  test('No status should appear in both OPEN and CLOSED arrays', () => {
    const overlap = OPEN_STATUSES.filter((status) =>
      CLOSED_STATUSES.includes(status)
    );
    expect(overlap).toHaveLength(0);
  });

  test('All statuses should be non-empty strings', () => {
    ALLOWED_STATUSES.forEach((status) => {
      expect(typeof status).toBe('string');
      expect(status.trim().length).toBeGreaterThan(0);
    });
  });
});

test.describe('Constants - JQL Patterns', () => {
  test('OPEN_STATUSES_JQL_PATTERN should match valid open statuses', () => {
    OPEN_STATUSES.forEach((status) => {
      const jqlQuery = `status = "${status}"`;
      expect(OPEN_STATUSES_JQL_PATTERN.test(jqlQuery)).toBe(true);
    });
  });

  test('CLOSED_STATUSES_JQL_PATTERN should match valid closed statuses', () => {
    CLOSED_STATUSES.forEach((status) => {
      const jqlQuery = `status = "${status}"`;
      expect(CLOSED_STATUSES_JQL_PATTERN.test(jqlQuery)).toBe(true);
    });
  });

  test('OPEN_STATUSES_JQL_PATTERN should not match closed statuses', () => {
    CLOSED_STATUSES.forEach((status) => {
      const jqlQuery = `status = "${status}"`;
      expect(OPEN_STATUSES_JQL_PATTERN.test(jqlQuery)).toBe(false);
    });
  });

  test('CLOSED_STATUSES_JQL_PATTERN should not match open statuses', () => {
    OPEN_STATUSES.forEach((status) => {
      const jqlQuery = `status = "${status}"`;
      expect(CLOSED_STATUSES_JQL_PATTERN.test(jqlQuery)).toBe(false);
    });
  });

  test('JQL patterns should be case-insensitive', () => {
    const openQuery = 'status = "open"'; // lowercase
    const closedQuery = 'status = "done"'; // lowercase

    expect(OPEN_STATUSES_JQL_PATTERN.test(openQuery)).toBe(true);
    expect(CLOSED_STATUSES_JQL_PATTERN.test(closedQuery)).toBe(true);
  });
});

test.describe('Constants - Timeouts', () => {
  test('TIMEOUTS should be defined', () => {
    expect(TIMEOUTS).toBeDefined();
  });

  test('All timeout values should be positive numbers', () => {
    Object.values(TIMEOUTS).forEach((timeout) => {
      expect(typeof timeout).toBe('number');
      expect(timeout).toBeGreaterThan(0);
    });
  });

  test('PAGE_LOAD timeout should be greater than QUICK_ACTION', () => {
    expect(TIMEOUTS.PAGE_LOAD).toBeGreaterThan(TIMEOUTS.QUICK_ACTION);
  });

  test('DROPDOWN_OPEN should be reasonable (between 5s and 30s)', () => {
    expect(TIMEOUTS.DROPDOWN_OPEN).toBeGreaterThanOrEqual(5000);
    expect(TIMEOUTS.DROPDOWN_OPEN).toBeLessThanOrEqual(30000);
  });

  test('Timeout keys should be descriptive strings', () => {
    const timeoutKeys = Object.keys(TIMEOUTS);
    timeoutKeys.forEach((key) => {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });
  });
});
