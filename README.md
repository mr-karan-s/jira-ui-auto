# Jira Filters UI Automation – Playwright

## Objective
This project demonstrates a scalable UI automation framework built using Playwright (JavaScript) to validate Jira filter workflows.


The automation covers:
- User login
- Navigation to Filters
- Creation of Open-status and Closed-status filters
- Validation that returned issues match expected workflow statuses


## Tech Stack
- Node.js
- Playwright (JavaScript)
- Page Object Model (POM)


## Project Structure
```
pages/
LoginPage.js # Login-related UI actions
HomePage.js # Post-login navigation
FiltersPage.js # Filters page actions and validations

tests/
filters/
filterWorkflow.spec.js # End-to-end filter validation flow

utils/
constants.js # Centralized status values

playwright.config.js
.env
```

## Test Flow Covered
1. User launches Jira
2. User logs in using email and password
3. User lands on the homepage (“Your work”)
4. User navigates to Filters → View all filters
5. User creates a filter for Open statuses (Open, To Do, In Progress)
6. Results are validated using the Status column
7. Existing filters are cleared
8. User creates a filter for Closed statuses (Done, Closed)
9. Results are validated using the Status column


## How to Set Up

### Prerequisites
Node.js (v16 or later)
npm

### Install dependencies
```bash
npm install

```

## Create a .env file in the project root
```
JIRA_URL=https://your-jira-instance.atlassian.net
JIRA_USERNAME=your.email@example.com
JIRA_PASSWORD=your_password_or_api_token
```

## How to run the tests

```bash
npx playwright test --headed
```

## To view the HTML report:

```bash
npx playwright show-report
```
# jira-ui-auto
UI Automation of JIRA Filters
