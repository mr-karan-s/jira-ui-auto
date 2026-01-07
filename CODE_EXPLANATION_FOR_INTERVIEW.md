# Complete Code Walkthrough - Interview Guide

**Purpose:** Understand how the Jira UI automation project works in detail  
**Target Audience:** Job interview candidates  
**Format:** Simple language with real-world examples  

---

## Table of Contents
1. Project Overview
2. Project Structure
3. How Tests Work (Step-by-Step)
4. Page Object Model Pattern
5. Global Setup Explained
6. Test Execution Flow
7. Common Interview Questions & Answers
8. Code Examples with Explanations

---

## 1. Project Overview

### What is this project?
This is an **automated testing project** that tests a Jira (project management software) web application. It verifies that filters work correctly - meaning when you select certain statuses (like "Open" or "Done"), the application shows the correct issues.

### Why do we need automated testing?
Imagine testing a feature manually:
- You open Jira
- You create a filter
- You select "Open" status
- You verify only Open issues appear
- You clear the filter
- You repeat for "Done" status
- This takes 10 minutes

With automation:
- The same test runs in 10 seconds
- It runs every time you make code changes
- You catch bugs faster
- You save time and money

### What does this project test?
```
Jira Filter Feature
├── Create a filter
├── Select status (Open, To Do, In Progress, Done, Closed)
├── Verify correct issues appear
├── Validate JQL query matches filter
└── Clear filters
```

### Technologies Used
- **Playwright** - Tool to automate browser interactions (click, type, wait)
- **Node.js** - JavaScript runtime environment
- **Page Object Model** - Design pattern for organizing test code

---

## 2. Project Structure

```
proj_jira_ui_auto/
├── .env                          # Your Jira credentials (NOT committed to Git)
├── .env.example                  # Template for .env (committed to Git)
├── playwright.config.js          # Configuration for how tests run
├── package.json                  # Project dependencies and scripts
├── README.md                      # Project documentation
│
├── pages/                         # Page Objects
│   ├── LoginPage.js              # How to interact with login page
│   ├── HomePage.js               # How to interact with home page
│   └── FiltersPage.js            # How to interact with filters page
│
├── tests/                         # Test files
│   ├── auth/
│   │   └── login.setup.js        # Global authentication (runs once before all tests)
│   └── filters/
│       └── filterWorkflow.spec.js # The actual test for filter validation
│
├── utils/                         # Shared utilities
│   └── constants.js              # Shared constants (status values, timeouts)
│
├── playwright-report/            # Test results (HTML report)
└── test-results/                 # Detailed test output
```

### What Each Folder Does

**`pages/`** - Page Objects
- Contains classes representing web pages
- Each class knows how to interact with that page
- Examples: Click button, fill form, wait for element

**`tests/`** - Test Specifications
- Contains the actual tests
- Tests describe what should happen
- Example: "When I select Open status, only Open issues appear"

**`utils/`** - Shared Utilities
- Shared code used by multiple tests
- Examples: Constants, helper functions

---

## 3. How Tests Work (Step-by-Step)

### The Complete Journey

**Start**: User runs `npx playwright test`

**Step 1: Global Setup (login.setup.js)**
```
1. Load environment variables from .env
2. Validate variables exist (JIRA_URL, JIRA_USERNAME, JIRA_PASSWORD)
3. Launch browser
4. Navigate to Jira
5. Type username
6. Click login button
7. Type password
8. Click login button
9. Wait for homepage
10. Save authentication session to storageState.json
11. Close browser
12. Validate storageState.json exists
```

Result: `storageState.json` file contains cookies and session data

**Step 2: Run Test (filterWorkflow.spec.js)**
```
1. Playwright loads authentication from storageState.json
2. Test code starts
3. Navigate to Jira (already logged in)
4. Navigate to Filters page
5. Create a filter
6. Select "Open" status
7. Verify only Open issues appear
8. Clear the filter
9. Repeat for "Done" status
10. Test passes
```

Result: Test report generated showing what passed/failed

---

## 4. Page Object Model Pattern

### What is a Page Object?
A Page Object is a class that represents a web page. Instead of writing the same element selectors over and over in tests, you write them once in a Page Object.

### Example: Without Page Object (Bad)
```javascript
test('Test filters', async ({ page }) => {
  // Hard to maintain - selectors are scattered everywhere
  await page.click('[data-testid="filters-button"]');
  await page.waitForSelector('text=Filters');
  await page.click('text=Create filter');
  await page.click('[data-testid="status.ui.filter.dropdown"]');
  await page.fill('input[value="Open"]', '');
  await page.click('[role="listbox"] >> text=Open');
});
```

Problems:
- Selectors repeated in multiple tests
- If selector changes, you fix it in 10 different tests
- Hard to read (what does `[data-testid="status.ui.filter.dropdown"]` do?)

### Example: With Page Object (Good)
```javascript
// FiltersPage.js
class FiltersPage {
  constructor(page) {
    this.page = page;
    this.createFilterButton = 'text=Create filter';
    this.statusDropdown = '[data-testid="status.ui.filter.dropdown"]';
  }

  async clickCreateFilter() {
    await this.page.click(this.createFilterButton);
  }

  async selectStatusFilters(statuses) {
    // Logic here
  }
}

// Test file
test('Test filters', async ({ page }) => {
  const filtersPage = new FiltersPage(page);
  
  await filtersPage.clickCreateFilter();
  await filtersPage.selectStatusFilters(['Open']);
  // Much cleaner!
});
```

Benefits:
- Selectors in one place
- Reusable methods
- Easy to maintain
- Clear what each method does

### Page Objects in This Project

**LoginPage.js** - Login page interactions
```javascript
class LoginPage {
  login(username, password) // Method to login
}
```

**HomePage.js** - Jira homepage interactions
```javascript
class HomePage {
  navigateToFiltersPage()        // Navigate to filters
  waitForHomePageToLoad()        // Wait for page to load
}
```

**FiltersPage.js** - Filter page interactions
```javascript
class FiltersPage {
  clickCreateFilter()            // Create a filter
  selectStatusFilters(statuses)  // Select statuses
  validateStatusesInResults()    // Verify correct issues shown
  clearAllFilters()              // Clear all filters
  switchToJQL()                  // Switch to JQL view
  getJQLQueryText()              // Get JQL query text
}
```

---

## 5. Global Setup Explained

### What is Global Setup?
Global Setup is code that runs ONCE before ANY test runs. It's perfect for expensive operations like authentication.

### Why We Need It

Without Global Setup:
```
Test 1: Login → Run → Logout
Test 2: Login → Run → Logout
Test 3: Login → Run → Logout
(3 logins = SLOW)
```

With Global Setup:
```
Global Setup: Login ONCE → Save session
Test 1: Use saved session
Test 2: Use saved session
Test 3: Use saved session
(1 login = FAST)
```

### How Global Setup Works

**Configuration (playwright.config.js)**
```javascript
module.exports = defineConfig({
  globalSetup: require.resolve('./tests/auth/login.setup.js'),
  use: {
    storageState: 'storageState.json',
  },
});
```

**Explanation:**
- `globalSetup`: File to run before tests
- `storageState`: Where to save/load authentication

**Global Setup File (tests/auth/login.setup.js)**
```javascript
require('dotenv').config({ path: '.env' });

async function globalSetup() {
  // Step 1: Check environment variables
  if (!process.env.JIRA_URL || ...) {
    throw new Error('Missing environment variables');
  }

  // Step 2: Launch browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Step 3: Navigate and login
  await page.goto(process.env.JIRA_URL);
  await page.fill('#username', process.env.JIRA_USERNAME);
  await page.click('#login-submit');
  await page.fill('#password', process.env.JIRA_PASSWORD);
  await page.click('#login-submit');

  // Step 4: Wait for success
  await page.waitForURL('**/jira/**');

  // Step 5: Save session
  await page.context().storageState({ path: 'storageState.json' });

  // Step 6: Cleanup
  await browser.close();
}

module.exports = globalSetup;
```

### What Gets Saved in storageState.json

```json
{
  "cookies": [
    {
      "name": "JSESSIONID",
      "value": "abc123def456...",
      "domain": "jira.example.com",
      "path": "/",
      "secure": true,
      "httpOnly": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://jira.example.com",
      "localStorage": [
        {
          "name": "jira_session",
          "value": "user_is_logged_in"
        }
      ]
    }
  ]
}
```

When tests run, Playwright loads this session automatically so tests start already logged in.

---

## 6. Test Execution Flow

### Complete Flow Diagram

```
1. Developer runs: npx playwright test
                    ↓
2. Playwright starts
                    ↓
3. Check if globalSetup defined → YES
                    ↓
4. Run globalSetup (login.setup.js)
   ├─ Load .env
   ├─ Validate environment variables
   ├─ Launch browser
   ├─ Navigate to Jira
   ├─ Enter credentials
   ├─ Wait for homepage
   ├─ Save session to storageState.json
   └─ Close browser
                    ↓
5. storageState.json created ✓
                    ↓
6. For each test file:
   ├─ Load authentication from storageState.json
   ├─ Run test
   └─ Report results
                    ↓
7. Generate HTML report
                    ↓
8. Done!
```

### What Happens in filterWorkflow.spec.js

```javascript
const { test } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const { FiltersPage } = require('../../pages/FiltersPage');
const { OPEN_STATUSES, CLOSED_STATUSES } = require('../../utils/constants');

test('Validate Open and Closed Jira Status Filters', async ({ page }) => {
  // ← At this point, Playwright has already:
  //   1. Loaded storageState.json
  //   2. Set cookies in the browser
  //   3. We're already logged in!

  const homePage = new HomePage(page);
  const filtersPage = new FiltersPage(page);

  // Step 1: Wait for homepage (already logged in)
  await homePage.waitForHomePageToLoad();

  // Step 2: Navigate to filters page
  await homePage.navigateToFiltersPage();
  await filtersPage.waitForFiltersPageToLoad();

  // Step 3: Create filter with Open statuses
  await filtersPage.clickCreateFilter();
  await filtersPage.selectStatusFilters(OPEN_STATUSES);
  // OPEN_STATUSES = ['Open', 'To Do', 'In Progress']

  // Step 4: Validate results
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);

  // Step 5: Clear filters
  await filtersPage.clearAllFilters();

  // Step 6: Create filter with Closed statuses
  await filtersPage.clickCreateFilter();
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);
  // CLOSED_STATUSES = ['Done', 'Closed']

  // Step 7: Validate results
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);
});
```

### Timeline of One Test

```
Time | Action                                  | Who
-----|----------------------------------------|----------
0s   | Start test                             | Test
1s   | Wait for homepage to load              | FiltersPage
2s   | Navigate to Filters page               | HomePage
3s   | Wait for Filters page to load          | FiltersPage
4s   | Click Create Filter button             | FiltersPage
5s   | Click status dropdown                  | FiltersPage
6s   | Wait for dropdown to open              | Playwright
7s   | Check each status (is it valid?)       | FiltersPage (validation)
8s   | Click each status checkbox             | FiltersPage
9s   | Close dropdown                         | FiltersPage
10s  | Get all status cells from results      | FiltersPage
11s  | Check each cell matches expected       | FiltersPage
12s  | Assert all statuses correct ✓          | Test
13s  | Test PASSED                            | Playwright
```

---

## 7. Common Interview Questions & Answers

### Q1: "What is Page Object Model and why do we use it?"

**Answer:**
Page Object Model is a design pattern where each web page is represented by a class. All interactions with that page (clicking buttons, filling forms) are methods in that class.

**Why use it:**
- **Maintainability:** If a selector changes, fix it in one place
- **Readability:** Clear method names like `selectStatusFilters()` vs `[data-testid="..."]`
- **Reusability:** Use the same method in multiple tests
- **Abstraction:** Tests don't care about HTML selectors

**Example:**
```javascript
// Instead of this in every test:
await page.click('[data-testid="status.ui.filter.dropdown"]');

// We have this:
await filtersPage.selectStatusFilters(['Open']);
```

---

### Q2: "What is Global Setup and why do we need it?"

**Answer:**
Global Setup is code that runs ONCE before ALL tests. We use it for expensive operations that should only happen once, like authentication.

**Why we need it:**
- **Performance:** Login once, not 3 times
- **Reliability:** Single source of authentication
- **Maintainability:** Change login logic in one place

**Example:**
```javascript
// Before: Each test logs in
Test 1: Login → Test → Logout (10s)
Test 2: Login → Test → Logout (10s)
Test 3: Login → Test → Logout (10s)
Total: 30s

// After: Global setup handles login
Global Setup: Login → Save session (5s)
Test 1: Use session → Test (5s)
Test 2: Use session → Test (5s)
Test 3: Use session → Test (5s)
Total: 20s (FASTER!)
```

---

### Q3: "What is storageState.json and what does it contain?"

**Answer:**
`storageState.json` is a file that stores the authenticated session. It contains cookies and local storage data from after a successful login.

**What it contains:**
- **Cookies:** Authentication tokens (like JSESSIONID)
- **LocalStorage:** Session information stored in browser
- **SessionStorage:** Temporary session data

**How it works:**
```javascript
// Global Setup
1. Login to Jira
2. Jira sets cookies in browser (JSESSIONID=abc123)
3. Save all cookies to storageState.json
4. Close browser

// Each Test
1. Load storageState.json
2. Set cookies in new browser
3. Browser thinks we're logged in
4. Run test (already authenticated)
```

---

### Q4: "What is input validation and why is it important?"

**Answer:**
Input validation is checking that data coming from outside meets requirements before using it. It's important for security and reliability.

**Example in our code:**
```javascript
async selectStatusFilters(statuses) {
  // Validation 1: Is it an array and not empty?
  if (!Array.isArray(statuses) || statuses.length === 0) {
    throw new Error('At least one status must be provided as an array.');
  }

  // Validation 2: Is each status in the whitelist?
  const invalidStatuses = statuses.filter(
    (status) => !this.constants.ALLOWED_STATUSES.includes(status)
  );
  if (invalidStatuses.length > 0) {
    throw new Error(`Invalid status values: ${invalidStatuses.join(', ')}`);
  }
}
```

**Why it's important:**
- **Security:** Prevents injection attacks
- **Reliability:** Catches mistakes early
- **User Experience:** Clear error messages

---

### Q5: "Why is the order of require() statements important?"

**Answer:**
In `login.setup.js`, we must load environment variables BEFORE anything that needs them.

**Wrong Order:**
```javascript
const { chromium } = require('@playwright/test');  // ❌ Tries to use env vars
require('dotenv').config();                        // Too late - env vars not loaded yet
```

**Right Order:**
```javascript
require('dotenv').config();                        // Load env vars first
const { chromium } = require('@playwright/test'); // Now we can use them
```

**Why:**
JavaScript reads files top-to-bottom. If something imports code that needs environment variables, those variables must be loaded first.

---

### Q6: "What are ALLOWED_STATUSES and why use a whitelist?"

**Answer:**
`ALLOWED_STATUSES` is a list of valid status values. We use a whitelist to prevent invalid values from being used.

**The whitelist:**
```javascript
ALLOWED_STATUSES: ['Open', 'To Do', 'In Progress', 'Done', 'Closed']
```

**Whitelist vs Blacklist:**
```javascript
// Whitelist: Only allow these ✓ (Secure)
if (!ALLOWED_STATUSES.includes(status)) reject;

// Blacklist: Block these (Insecure)
if (BAD_VALUES.includes(status)) reject; // What about new bad values?
```

**Why whitelist is better:**
- Whitelist: "I know what's good, allow only those"
- Blacklist: "I know what's bad, block those" (but there might be new bad values)

---

### Q7: "What does the test do step-by-step?"

**Answer:**
```
Test: Validate Open and Closed Jira Status Filters

Step 1: Initialize page objects
  └─ Create HomePage and FiltersPage objects

Step 2: Open filter for Open statuses
  ├─ Wait for homepage
  ├─ Click Filters button
  ├─ Wait for Filters page
  ├─ Click Create Filter
  └─ Select 'Open', 'To Do', 'In Progress'

Step 3: Verify only Open statuses appear
  └─ Check each issue's status is in OPEN_STATUSES

Step 4: Clear filters
  └─ Click Clear button

Step 5: Open filter for Closed statuses
  ├─ Click Create Filter
  └─ Select 'Done', 'Closed'

Step 6: Verify only Closed statuses appear
  └─ Check each issue's status is in CLOSED_STATUSES

Step 7: Test passes
```

---

### Q8: "What happens if authentication fails in global setup?"

**Answer:**
Global Setup throws an error and all tests fail. Here's the flow:

```javascript
// In login.setup.js
if (!process.env.JIRA_URL || ...) {
  throw new Error('Missing environment variables');
  // ↑ GlobalSetup fails here
}

// Result: All tests are skipped
// Error message shown to developer
```

**How to debug:**
1. Check `.env` file exists
2. Check variables are set correctly
3. Check Jira URL is accessible
4. Check username/password are correct

---

## 8. Code Examples with Explanations

### Example 1: Environment Variables

**File: `.env`**
```
JIRA_URL=https://your-jira-instance.atlassian.net
JIRA_USERNAME=your.email@example.com
JIRA_PASSWORD=your_api_token
```

**Why separate file:**
- Credentials are sensitive (never commit to Git)
- Different environments need different credentials
- Easy to change without touching code

**How it's used in `login.setup.js`:**
```javascript
require('dotenv').config({ path: '.env' });

// Now available as:
process.env.JIRA_URL          // → 'https://...'
process.env.JIRA_USERNAME     // → 'your.email@example.com'
process.env.JIRA_PASSWORD     // → 'your_api_token'
```

---

### Example 2: Constants

**File: `utils/constants.js`**
```javascript
module.exports = {
  OPEN_STATUSES: ['Open', 'To Do', 'In Progress'],
  CLOSED_STATUSES: ['Done', 'Closed'],
  ALLOWED_STATUSES: ['Open', 'To Do', 'In Progress', 'Done', 'Closed'],
  
  TIMEOUTS: {
    PAGE_LOAD: 30000,      // 30 seconds
    DROPDOWN_OPEN: 10000,  // 10 seconds
    QUICK_ACTION: 5000,    // 5 seconds
    FILTER_CLEAR: 1000,    // 1 second
  },
};
```

**Why use constants:**
- **Single source of truth:** Change value once, used everywhere
- **Readability:** `TIMEOUTS.PAGE_LOAD` is clearer than `30000`
- **Maintainability:** Easy to adjust for different environments

**How it's used:**
```javascript
// Instead of:
await page.waitForSelector(header, { timeout: 30000 });

// We use:
await page.waitForSelector(header, { 
  timeout: this.constants.TIMEOUTS.PAGE_LOAD 
});
```

---

### Example 3: Input Validation

**Before (No Validation - Bad):**
```javascript
async selectStatusFilters(statuses) {
  // Just trust the input!
  await this.page.click(this.statusDropdown);
  
  for (const status of statuses) {
    const checkbox = this.page.locator(`input[value="${status}"]`);
    await checkbox.check(); // ❌ What if checkbox doesn't exist?
  }
}

// Caller can do:
await filtersPage.selectStatusFilters(['<script>alert(1)</script>']);
// ❌ Security vulnerability!
```

**After (With Validation - Good):**
```javascript
async selectStatusFilters(statuses) {
  // Validation 1: Type check
  if (!Array.isArray(statuses) || statuses.length === 0) {
    throw new Error('At least one status must be provided as an array.');
  }

  // Validation 2: Whitelist check
  const invalidStatuses = statuses.filter(
    (status) => !this.constants.ALLOWED_STATUSES.includes(status)
  );
  if (invalidStatuses.length > 0) {
    throw new Error(
      `Invalid status values: ${invalidStatuses.join(', ')}. ` +
      `Allowed: ${this.constants.ALLOWED_STATUSES.join(', ')}`
    );
  }

  // Now proceed safely
  await this.page.click(this.statusDropdown);
  
  for (const status of statuses) {
    // Validation 3: Element check
    const checkbox = this.page.locator(`input[value="${status}"]`);
    const count = await checkbox.count();
    if (count === 0) {
      throw new Error(`Status checkbox for "${status}" not found`);
    }
    await checkbox.check();
  }
}

// Now caller can't misuse:
await filtersPage.selectStatusFilters(['<script>...']); // ❌ Error thrown
await filtersPage.selectStatusFilters(['Open']);         // ✅ Works
```

---

### Example 4: Page Object Class

**File: `pages/FiltersPage.js`**
```javascript
class FiltersPage {
  // Constructor: Initialize page object with the browser page
  constructor(page) {
    this.page = page;
    this.constants = require('../utils/constants');

    // Define all element selectors here (one place)
    this.filtersPageHeader = 'text=Filters';
    this.createFilterButton = 'text=Create filter';
    this.statusColumn = '[data-testid="issue.status"]';
    this.statusDropdown = '[data-testid="status.ui.filter.dropdown"]';
    this.clearFiltersButton = 'text=Clear';
    this.switchToJQLButton = 'text=Switch to JQL';
    this.jqlInputField = 'input[data-testid="jql.input"]';
  }

  // Method: Wait for page to load
  async waitForFiltersPageToLoad() {
    await this.page.waitForSelector(this.filtersPageHeader, {
      timeout: this.constants.TIMEOUTS.PAGE_LOAD,
    });
  }

  // Method: Click create filter button
  async clickCreateFilter() {
    await this.page.click(this.createFilterButton);
  }

  // Method: Select status filters with validation
  async selectStatusFilters(statuses) {
    // Validation...
    
    // Click dropdown
    await this.page.click(this.statusDropdown);

    // Wait for dropdown
    await this.page.waitForSelector('[role="listbox"]', {
      timeout: this.constants.TIMEOUTS.DROPDOWN_OPEN,
    });

    // Select each status
    for (const status of statuses) {
      const checkbox = this.page.locator(`input[value="${status}"]`);
      await checkbox.check();
    }

    // Close dropdown
    await this.page.keyboard.press('Escape');
  }

  // Method: Validate results show correct statuses
  async validateStatusesInResults(expectedStatuses) {
    const statusCells = this.page.locator(this.statusColumn);
    const count = await statusCells.count();

    if (count === 0) {
      console.warn('No issues returned for the applied filter');
      return;
    }

    for (let i = 0; i < count; i++) {
      const statusText = await statusCells.nth(i).innerText();

      if (!expectedStatuses.includes(statusText)) {
        throw new Error(
          `Unexpected status found: ${statusText}. ` +
          `Expected one of: ${expectedStatuses.join(', ')}`
        );
      }
    }
  }
}

module.exports = FiltersPage;
```

---

### Example 5: Test Using Page Objects

**File: `tests/filters/filterWorkflow.spec.js`**
```javascript
const { test } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const { FiltersPage } = require('../../pages/FiltersPage');
const { 
  OPEN_STATUSES, 
  CLOSED_STATUSES 
} = require('../../utils/constants');

test('Validate Open and Closed Jira Status Filters', async ({ page }) => {
  // 1. Create page object instances
  const homePage = new HomePage(page);
  const filtersPage = new FiltersPage(page);

  // 2. Already logged in (global setup handled authentication)
  await homePage.waitForHomePageToLoad();

  // 3. Navigate to filters
  await homePage.navigateToFiltersPage();
  await filtersPage.waitForFiltersPageToLoad();

  // ===== TEST OPEN STATUSES =====
  
  // 4. Create filter
  await filtersPage.clickCreateFilter();

  // 5. Select Open statuses
  await filtersPage.selectStatusFilters(OPEN_STATUSES);
  // OPEN_STATUSES = ['Open', 'To Do', 'In Progress']

  // 6. Verify results
  await filtersPage.validateStatusesInResults(OPEN_STATUSES);
  // Checks that all issues shown have status in ['Open', 'To Do', 'In Progress']

  // ===== CLEAR AND TEST CLOSED STATUSES =====

  // 7. Clear filters
  await filtersPage.clearAllFilters();

  // 8. Create filter
  await filtersPage.clickCreateFilter();

  // 9. Select Closed statuses
  await filtersPage.selectStatusFilters(CLOSED_STATUSES);
  // CLOSED_STATUSES = ['Done', 'Closed']

  // 10. Verify results
  await filtersPage.validateStatusesInResults(CLOSED_STATUSES);
  // Checks that all issues shown have status in ['Done', 'Closed']

  // Test completes here - if no errors thrown, test PASSED ✓
});
```

---

## Interview Preparation Tips

### Things to Memorize
1. **What Playwright does:** Automates browser interactions (click, type, wait)
2. **What Page Object does:** Organizes test code by representing pages as classes
3. **What Global Setup does:** Runs once to authenticate before all tests
4. **What storageState.json does:** Stores authenticated session for reuse
5. **What validation does:** Checks input before using it (security and reliability)

### Things to Understand (Not Memorize)
1. Why we use Page Objects (maintainability, reusability)
2. Why we use Global Setup (performance, reliability)
3. Why we validate input (security, reliability)
4. How cookies work (authentication tokens stored in browser)
5. How environment variables work (.env file vs process.env)

### Practice Explanations
- Explain what happens from `npm test` to first test running (30 seconds)
- Explain why Global Setup is better than login in each test (2 minutes)
- Explain input validation with an injection attack example (2 minutes)
- Explain Page Object Model pattern and benefits (2 minutes)

### What NOT to Say in Interview
❌ "I'm not sure how it works"
❌ "I just copy-paste from Stack Overflow"
❌ "I don't know what environment variables are"
❌ "I never thought about security"

### What TO Say in Interview
✅ "Global Setup runs once before all tests to authenticate efficiently"
✅ "We validate input against a whitelist to prevent injection attacks"
✅ "Page Objects help us organize code and make tests maintainable"
✅ "We use environment variables to keep secrets out of version control"

---

## Summary

This project demonstrates several important automation testing concepts:

1. **Playwright** - Browser automation framework
2. **Page Object Model** - Design pattern for organizing test code
3. **Global Setup** - Running expensive operations once
4. **Input Validation** - Security and reliability
5. **Environment Variables** - Keeping secrets safe
6. **Constants** - Single source of truth

Understanding these concepts will help you excel in automation testing interviews!

