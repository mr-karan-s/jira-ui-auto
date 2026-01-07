# Business Logic Violations in Page Objects - Analysis

**Issue:** Page objects currently contain business logic and validation that should be in tests.

---

## Current Issues

### Issue 1: Input Validation in FiltersPage.selectStatusFilters()

**Location:** `pages/FiltersPage.js` lines 54-72

**Current Code:**
```javascript
async selectStatusFilters(statuses) {
  // ❌ BUSINESS LOGIC: Validating input values
  if (!Array.isArray(statuses) || statuses.length === 0) {
    throw new Error('At least one status must be provided as an array.');
  }

  // ❌ BUSINESS LOGIC: Checking against whitelist
  const invalidStatuses = statuses.filter(
    (status) => !this.constants.ALLOWED_STATUSES.includes(status)
  );
  if (invalidStatuses.length > 0) {
    throw new Error(`Invalid status values...`);
  }

  // ✅ UI INTERACTION: This is OK (clicking, checking boxes)
  await this.statusDropdown.open();
  for (const status of statuses) {
    const statusCheckbox = new CheckboxComponent(...);
    if (!(await statusCheckbox.exists())) {
      throw new Error(`Checkbox for "${status}" not found...`);
    }
    await statusCheckbox.check();
  }
  await this.statusDropdown.close();
}
```

**Problem:**
- Input validation (whitelist check, array check) is BUSINESS LOGIC
- This belongs in TEST CODE, not page objects
- Page objects should trust the test provides correct input
- If validation fails, the TEST should handle it

**NashTech Principle:**
> "POM classes should expose UI interactions; business logic and decisions belong in the test code"

---

### Issue 2: Result Validation in FiltersPage.validateStatusesInResults()

**Location:** `pages/FiltersPage.js` lines 49-51

**Current Code:**
```javascript
async validateStatusesInResults(expectedStatuses) {
  // ❌ BUSINESS LOGIC: Deciding which statuses should be in results
  await this.statusTable.validateAllCellsContainExpectedValues(expectedStatuses);
}
```

**Problem:**
- The validation logic is delegated to TableComponent, but the DECISION to validate is business logic
- The test should decide what to validate
- Page object should expose "get results" and "verify results" separately

**Better Approach:**
```javascript
// Page Object: Just expose the data
async getResultStatuses() {
  return await this.statusTable.getAllRowTexts();
}

// Test: Make the decision
const statuses = await filtersPage.getResultStatuses();
expect(statuses).toEqual(expectedStatuses);
```

---

### Issue 3: Multi-Step Workflow in Tests

**Location:** `tests/filters/filterWorkflow.spec.js` lines 25-41

**Current Code:**
```javascript
// ===== OPEN STATUS FILTER =====
await filtersPage.clickCreateFilter();                      // Decision: Create filter
await filtersPage.selectStatusFilters(OPEN_STATUSES);       // Decision: Select these statuses
await filtersPage.validateStatusesInResults(OPEN_STATUSES); // Decision: Validate these statuses

// ===== CLEAR FILTERS =====
await filtersPage.clearAllFilters();                         // Decision: Clear (good)

// ===== CLOSED / DONE STATUS FILTER =====
await filtersPage.clickCreateFilter();                      // Decision: Create filter
await filtersPage.selectStatusFilters(CLOSED_STATUSES);     // Decision: Select these statuses
await filtersPage.validateStatusesInResults(CLOSED_STATUSES); // Decision: Validate these statuses
```

**Analysis:**
- ✅ Test orchestrates workflow (CREATE → SELECT → VALIDATE)
- ✅ Test decides WHAT statuses to use
- ❌ But page object validates instead of just providing data
- ❌ Page object does input validation instead of UI interaction

---

## NashTech POM Best Practices

### ✅ CORRECT - What Page Objects Should Do

```javascript
class FiltersPage {
  // UI INTERACTIONS: These are correct
  async clickCreateFilter() {
    await this.createFilterButton.click();
  }

  async openStatusDropdown() {
    await this.statusDropdown.open();
  }

  async selectStatusByCheckbox(status) {
    const checkbox = new CheckboxComponent(this.page, `input[value="${status}"]`);
    await checkbox.check();
  }

  async closeStatusDropdown() {
    await this.statusDropdown.close();
  }

  // DATA RETRIEVAL: These are correct
  async getResultStatuses() {
    return await this.statusTable.getAllRowTexts();
  }

  async getJQLQuery() {
    return await this.jqlInput.getValue();
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
    await this.wait(this.constants.TIMEOUTS.FILTER_CLEAR);
  }
}
```

### ❌ WRONG - What Page Objects Should NOT Do

```javascript
class FiltersPage {
  // ❌ BUSINESS LOGIC: Validation
  async selectStatusFilters(statuses) {
    if (!Array.isArray(statuses)) { throw new Error(...); } // NO!
    const invalid = statuses.filter(s => !ALLOWED.includes(s)); // NO!
    if (invalid.length > 0) { throw new Error(...); } // NO!
  }

  // ❌ BUSINESS LOGIC: Decision making
  async validateStatusesInResults(expected) {
    const actual = await this.getResults();
    // NO! Don't compare here! That's the test's job!
    for (const item of actual) {
      if (!expected.includes(item)) { throw new Error(...); } // NO!
    }
  }

  // ❌ MULTI-PAGE WORKFLOW: Orchestration
  async executeFilterWorkflow(statuses) {
    // NO! This is workflow orchestration!
    // It should be in the test, not the page object!
    await this.clickCreateFilter();
    await this.selectStatusFilters(statuses);
    await this.validateStatusesInResults(statuses);
  }
}
```

---

## Recommended Refactoring

### Step 1: Remove Input Validation from FiltersPage

**Before:**
```javascript
async selectStatusFilters(statuses) {
  // ❌ Remove this validation
  if (!Array.isArray(statuses) || statuses.length === 0) {
    throw new Error('At least one status must be provided as an array.');
  }

  const invalidStatuses = statuses.filter(
    (status) => !this.constants.ALLOWED_STATUSES.includes(status)
  );
  if (invalidStatuses.length > 0) {
    throw new Error(`Invalid status values...`);
  }

  // Keep only UI interactions
  await this.statusDropdown.open();
  for (const status of statuses) {
    const statusCheckbox = new CheckboxComponent(this.page, `input[value="${status}"]`);
    await statusCheckbox.check();
  }
  await this.statusDropdown.close();
}
```

**After:**
```javascript
async selectStatusFilters(statuses) {
  // Open dropdown
  await this.statusDropdown.open();

  // Select each status checkbox
  for (const status of statuses) {
    const statusCheckbox = new CheckboxComponent(this.page, `input[value="${status}"]`);
    await statusCheckbox.check();
  }

  // Close dropdown
  await this.statusDropdown.close();
}
```

**Rationale:**
- Page object trusts the test provides valid input
- No business logic about WHAT is valid
- Just exposes the UI interaction

---

### Step 2: Expose Data, Not Assertions

**Before:**
```javascript
async validateStatusesInResults(expectedStatuses) {
  await this.statusTable.validateAllCellsContainExpectedValues(expectedStatuses);
}
```

**After:**
```javascript
async getResultStatuses() {
  return await this.statusTable.getAllRowTexts();
}
```

**Rationale:**
- Page object provides DATA
- Test makes the DECISION about what data is correct
- Separation of concerns

---

### Step 3: Update Test to Own Business Logic

**Before:**
```javascript
test('Validate Open and Closed Jira Status Filters', async ({ page }) => {
  const filtersPage = new FiltersPage(page);

  await filtersPage.selectStatusFilters(OPEN_STATUSES);
  await filtersPage.validateStatusesInResults(OPEN_STATUSES); // ❌ POM validates
});
```

**After:**
```javascript
test('Validate Open and Closed Jira Status Filters', async ({ page }) => {
  const filtersPage = new FiltersPage(page);

  // Test decides WHAT to select
  await filtersPage.selectStatusFilters(OPEN_STATUSES);

  // Test validates the RESULTS
  const actualStatuses = await filtersPage.getResultStatuses();
  expect(actualStatuses).toEqual(expect.arrayContaining(OPEN_STATUSES));
});
```

**Rationale:**
- Test owns the business logic (what should happen)
- Page object owns the UI interactions (how it happens)
- Clear separation

---

## Summary of Changes Needed

| Component | Current | Should Be | Reason |
|-----------|---------|-----------|--------|
| **Input Validation** | In FiltersPage | In Test | Business logic ≠ UI |
| **Result Validation** | In FiltersPage | In Test | Assertions ≠ UI |
| **Data Retrieval** | `validateStatusesInResults()` | `getResultStatuses()` | Return data, not assertions |
| **Workflow Orchestration** | In Test (good) | In Test (keep) | Tests orchestrate flows |
| **UI Interactions** | In FiltersPage (good) | In FiltersPage (keep) | POMs expose interactions |

---

## NashTech Guidelines Reference

> **Page Object Model Best Practice:**
> "Page Object classes should encapsulate UI elements and their interactions, but not business logic. 
> Tests should own the decision-making about when to apply filters, which values to use, and how to validate results."

> **Separation of Concerns:**
> - **Page Objects:** What? (UI elements, locators, methods to interact)
> - **Tests:** How often? When? Which values? (Workflow, decisions, validation)

---

## Benefits of This Refactoring

✅ **Clearer Responsibilities**
- Page objects = UI interactions only
- Tests = Business logic and decisions

✅ **Better Reusability**
- `selectStatusFilters(statuses)` works for ANY statuses
- Not locked into specific business rules

✅ **Easier Testing**
- Can write unit tests for pages without business logic
- Can test business logic without UI

✅ **More Maintainable**
- Change business rules in tests, not pages
- Change UI in pages, not tests

✅ **Follows NashTech Guidelines**
- Professional, industry-standard approach
- Interview-friendly design patterns

