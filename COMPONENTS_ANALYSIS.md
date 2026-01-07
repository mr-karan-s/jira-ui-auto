# Reusable Components Analysis

**Purpose:** Identify components that can be extracted from page classes and made into separate, reusable component classes.

---

## Current Page Classes Analysis

### 1. LoginPage.js
**Responsibility:** Handle Jira login flow

**Components/Patterns Used:**
- Form field interaction (email input, password input)
- Form submission (login button click)
- Multi-step form flow (fill → click → fill → click)

---

### 2. HomePage.js
**Responsibility:** Handle Jira home page interactions

**Components/Patterns Used:**
- Tab selection (Your Work tab)
- Navigation menu (Filters menu)
- Dropdown menu option selection (View all filters)

---

### 3. FiltersPage.js
**Responsibility:** Handle Jira filter creation and validation

**Components/Patterns Used:**
- Dropdown selection (status dropdown)
- Multiple checkbox selection
- Results table (status column)
- View switching (Basic ↔ JQL)
- Query input field

---

## Reusable Components Identified

### Component 1: Dropdown Component ⭐⭐⭐
**Usage:**
- FiltersPage: Status dropdown (`selectStatusFilters()`)
- HomePage: Filters menu with View all filters option (`navigateToFiltersPage()`)
- **Reusability:** HIGH - Dropdowns are common UI patterns

**Locators:**
```javascript
// Status Dropdown (FiltersPage)
statusDropdown = '[data-testid="status.ui.filter.dropdown"]';
dropdownListBox = '[role="listbox"]';

// Filters Menu (HomePage)
filtersMenu = 'text=Filters';
viewAllFiltersOption = 'text=View all filters';
```

**Operations:**
- Click dropdown to open
- Wait for dropdown options to appear
- Select items from dropdown
- Close dropdown (Escape key)

**Component Class Name:** `DropdownComponent.js`

---

### Component 2: Form Input Component ⭐⭐⭐
**Usage:**
- LoginPage: Email and password inputs (`login()`)
- **Reusability:** HIGH - Forms are everywhere

**Locators:**
```javascript
// Login Form (LoginPage)
emailInput = '#username';
passwordInput = '#password';
```

**Operations:**
- Fill input field with value
- Get input value
- Clear input field
- Validate input exists

**Component Class Name:** `FormInputComponent.js`

---

### Component 3: Table/Results Component ⭐⭐
**Usage:**
- FiltersPage: Status column validation (`validateStatusesInResults()`)
- **Reusability:** MEDIUM - Common in data-heavy applications

**Locators:**
```javascript
// Status Column (FiltersPage)
statusColumn = '[data-testid="issue.status"]';
```

**Operations:**
- Get all rows/cells
- Get text from cell at index
- Validate all cells contain expected values
- Get cell count
- Handle empty results

**Component Class Name:** `TableComponent.js`

---

### Component 4: Checkbox Component ⭐⭐
**Usage:**
- FiltersPage: Status checkboxes (`selectStatusFilters()`)
- **Reusability:** MEDIUM - Checkboxes common in filters/forms

**Locators:**
```javascript
// Status Checkboxes (FiltersPage)
statusCheckbox = `input[value="${status}"]`;
```

**Operations:**
- Check checkbox
- Uncheck checkbox
- Check if checkbox exists
- Check if checkbox is checked
- Get checkbox value

**Component Class Name:** `CheckboxComponent.js`

---

### Component 5: Tab/Button Navigation Component ⭐⭐
**Usage:**
- HomePage: Tab selection, button navigation
- FiltersPage: View switching (Basic ↔ JQL)
- **Reusability:** MEDIUM - Navigation common pattern

**Locators:**
```javascript
// Tabs/Buttons
yourWorkTab = 'text=Your work';
switchToJQLButton = 'text=Switch to JQL';
switchToBasicButton = 'text=Switch to basic';
```

**Operations:**
- Click element
- Wait for element to appear
- Validate element exists

**Component Class Name:** `NavigationComponent.js` or `ButtonComponent.js`

---

### Component 6: Query/Text Input Component ⭐
**Usage:**
- FiltersPage: JQL input field (`getJQLQueryText()`)
- **Reusability:** LOW - Specific to JQL, but pattern is common

**Locators:**
```javascript
// JQL Input (FiltersPage)
jqlInputField = 'input[data-testid="jql.input"]';
```

**Operations:**
- Get input value
- Fill input value
- Clear input
- Get placeholder text

**Component Class Name:** `TextInputComponent.js`

---

## Summary Table

| Component | Usage Count | Reusability | Complexity | Priority |
|-----------|-------------|-------------|-----------|----------|
| **DropdownComponent** | 2+ | HIGH | Medium | 🔴 HIGH |
| **FormInputComponent** | 1+ | HIGH | Low | 🔴 HIGH |
| **TableComponent** | 1+ | MEDIUM | Medium | 🟡 MEDIUM |
| **CheckboxComponent** | 1+ | MEDIUM | Low | 🟡 MEDIUM |
| **NavigationComponent** | 2+ | MEDIUM | Low | 🟡 MEDIUM |
| **TextInputComponent** | 1+ | LOW | Low | 🟢 LOW |

---

## Recommended Implementation Order

### Phase 1 (High Priority):
1. **DropdownComponent** - Most reusable, used across multiple pages
2. **FormInputComponent** - Common pattern in forms

### Phase 2 (Medium Priority):
3. **TableComponent** - Data validation patterns
4. **CheckboxComponent** - Common in filters
5. **NavigationComponent** - Button/Tab interactions

### Phase 3 (Optional):
6. **TextInputComponent** - Specific to query inputs

---

## Code Structure After Refactoring

```
pages/
├── components/                    # New: Component classes
│   ├── DropdownComponent.js       # Dropdown operations
│   ├── FormInputComponent.js      # Form field operations
│   ├── TableComponent.js          # Table/Results operations
│   ├── CheckboxComponent.js       # Checkbox operations
│   ├── NavigationComponent.js     # Button/Tab operations
│   └── TextInputComponent.js      # Text field operations
│
├── BasePage.js                    # Base class (existing)
├── LoginPage.js                   # Uses FormInputComponent
├── HomePage.js                    # Uses DropdownComponent, NavigationComponent
└── FiltersPage.js                 # Uses DropdownComponent, CheckboxComponent, TableComponent, TextInputComponent
```

---

## Example: How Components Will Be Used

### Before (Current - With Duplication):
```javascript
// FiltersPage
async selectStatusFilters(statuses) {
  await this.click(this.statusDropdown);
  await this.waitForElement('[role="listbox"]', this.constants.TIMEOUTS.DROPDOWN_OPEN);
  
  for (const status of statuses) {
    const checkbox = `input[value="${status}"]`;
    if (!(await this.elementExists(checkbox))) {
      throw new Error(`Checkbox not found`);
    }
    await this.check(checkbox);
  }
  
  await this.pressKey('Escape');
}

// HomePage (similar dropdown logic)
async navigateToFiltersPage() {
  await this.click(this.filtersMenu);
  // Implicit dropdown handling, no validation
  await this.click(this.viewAllFiltersOption);
}
```

### After (With Components - No Duplication):
```javascript
// FiltersPage - Using DropdownComponent
async selectStatusFilters(statuses) {
  const dropdown = new DropdownComponent(this.page, this.statusDropdown);
  
  for (const status of statuses) {
    await dropdown.selectOption(status); // Handles all dropdown + checkbox logic
  }
}

// HomePage - Using DropdownComponent
async navigateToFiltersPage() {
  const dropdown = new DropdownComponent(this.page, this.filtersMenu);
  await dropdown.selectOption('View all filters');
}
```

---

## Benefits of Component Extraction

✅ **Reduced Duplication** - Dropdown logic in one place  
✅ **Consistency** - Same dropdown behavior everywhere  
✅ **Maintainability** - Fix dropdown bug once, fixes everywhere  
✅ **Testability** - Components can be unit tested independently  
✅ **Reusability** - Easy to add new pages that use these components  
✅ **Scalability** - New pages can be built faster with existing components  
✅ **Readability** - `await dropdown.selectOption()` clearer than step-by-step clicks  

---

## Recommended Next Steps

1. ✅ **This Analysis** - Identify components (DONE)
2. 📝 **Create DropdownComponent.js** - Start with highest reusability
3. 📝 **Create FormInputComponent.js** - Second highest reusability
4. 📝 **Refactor Page Classes** - Update to use new components
5. 📝 **Create Remaining Components** - TableComponent, CheckboxComponent, NavigationComponent
6. ✅ **Update Tests** - Ensure all tests still pass

