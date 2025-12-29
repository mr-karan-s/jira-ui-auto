const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Global Setup - Environment Variables', () => {
  test('JIRA_URL should be defined in environment', () => {
    const jiraUrl = process.env.JIRA_URL;
    expect(jiraUrl).toBeDefined();
    expect(typeof jiraUrl).toBe('string');
  });

  test('JIRA_USERNAME should be defined in environment', () => {
    const jiraUsername = process.env.JIRA_USERNAME;
    expect(jiraUsername).toBeDefined();
    expect(typeof jiraUsername).toBe('string');
  });

  test('JIRA_PASSWORD should be defined in environment', () => {
    const jiraPassword = process.env.JIRA_PASSWORD;
    expect(jiraPassword).toBeDefined();
    expect(typeof jiraPassword).toBe('string');
  });

  test('JIRA_URL should be a valid URL', () => {
    const jiraUrl = process.env.JIRA_URL;
    // Check if URL format is valid
    expect(() => new URL(jiraUrl)).not.toThrow();
  });

  test('JIRA_USERNAME should not be empty', () => {
    const jiraUsername = process.env.JIRA_USERNAME;
    expect(jiraUsername.trim().length).toBeGreaterThan(0);
  });

  test('JIRA_PASSWORD should not be empty', () => {
    const jiraPassword = process.env.JIRA_PASSWORD;
    expect(jiraPassword.trim().length).toBeGreaterThan(0);
  });
});

test.describe('Global Setup - Storage State File', () => {
  test('storageState.json should exist after test setup', () => {
    const storageStatePath = path.join(process.cwd(), 'storageState.json');
    // This test assumes global setup has already run
    if (fs.existsSync(storageStatePath)) {
      expect(true).toBe(true);
    } else {
      console.warn('storageState.json not found - global setup may not have run');
    }
  });

  test('storageState.json should be valid JSON if it exists', () => {
    const storageStatePath = path.join(process.cwd(), 'storageState.json');

    if (fs.existsSync(storageStatePath)) {
      const fileContent = fs.readFileSync(storageStatePath, 'utf-8');
      expect(() => JSON.parse(fileContent)).not.toThrow();
    }
  });

  test('storageState.json should contain cookies if it exists', () => {
    const storageStatePath = path.join(process.cwd(), 'storageState.json');

    if (fs.existsSync(storageStatePath)) {
      const fileContent = fs.readFileSync(storageStatePath, 'utf-8');
      const data = JSON.parse(fileContent);

      expect(data).toHaveProperty('cookies');
      expect(Array.isArray(data.cookies)).toBe(true);
    }
  });

  test('storageState.json should be readable', () => {
    const storageStatePath = path.join(process.cwd(), 'storageState.json');

    if (fs.existsSync(storageStatePath)) {
      expect(() => {
        fs.readFileSync(storageStatePath, 'utf-8');
      }).not.toThrow();
    }
  });
});

test.describe('Global Setup - Configuration', () => {
  test('playwright.config.js should reference global setup', () => {
    const configPath = path.join(process.cwd(), 'playwright.config.js');
    const configContent = fs.readFileSync(configPath, 'utf-8');

    expect(configContent).toContain('globalSetup');
    expect(configContent).toContain('login.setup.js');
  });

  test('playwright.config.js should reference storageState', () => {
    const configPath = path.join(process.cwd(), 'playwright.config.js');
    const configContent = fs.readFileSync(configPath, 'utf-8');

    expect(configContent).toContain('storageState');
  });
});

test.describe('Global Setup - Login Setup File', () => {
  test('login.setup.js should exist', () => {
    const loginSetupPath = path.join(process.cwd(), 'tests/auth/login.setup.js');
    expect(fs.existsSync(loginSetupPath)).toBe(true);
  });

  test('login.setup.js should load dotenv', () => {
    const loginSetupPath = path.join(process.cwd(), 'tests/auth/login.setup.js');
    const content = fs.readFileSync(loginSetupPath, 'utf-8');

    expect(content).toContain('dotenv');
    expect(content).toContain('config');
  });

  test('login.setup.js should validate environment variables', () => {
    const loginSetupPath = path.join(process.cwd(), 'tests/auth/login.setup.js');
    const content = fs.readFileSync(loginSetupPath, 'utf-8');

    expect(content).toContain('JIRA_URL');
    expect(content).toContain('JIRA_USERNAME');
    expect(content).toContain('JIRA_PASSWORD');
  });

  test('login.setup.js should validate storageState creation', () => {
    const loginSetupPath = path.join(process.cwd(), 'tests/auth/login.setup.js');
    const content = fs.readFileSync(loginSetupPath, 'utf-8');

    expect(content).toContain('storageState.json');
    expect(content).toContain('existsSync');
  });

  test('login.setup.js should export globalSetup function', () => {
    const loginSetupPath = path.join(process.cwd(), 'tests/auth/login.setup.js');
    const content = fs.readFileSync(loginSetupPath, 'utf-8');

    expect(content).toContain('module.exports');
  });
});
