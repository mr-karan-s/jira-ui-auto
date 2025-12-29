module.exports = {
  // Status constants
  OPEN_STATUSES: ['Open', 'To Do', 'In Progress'],
  CLOSED_STATUSES: ['Done', 'Closed'],
  
  // All allowed statuses (whitelist for validation)
  ALLOWED_STATUSES: ['Open', 'To Do', 'In Progress', 'Done', 'Closed'],
  
  // JQL query patterns for validation
  OPEN_STATUSES_JQL_PATTERN: /status\s*=\s*"?(?:Open|To Do|In Progress)"?/i,
  CLOSED_STATUSES_JQL_PATTERN: /status\s*=\s*"?(?:Done|Closed)"?/i,

  // Timeout constants (in milliseconds)
  TIMEOUTS: {
    PAGE_LOAD: 30000,      // 30 seconds for page navigation and load
    DROPDOWN_OPEN: 10000,  // 10 seconds for dropdown to appear
    QUICK_ACTION: 5000,    // 5 seconds for quick actions like clicks
    FILTER_CLEAR: 1000,    // 1 second for filter clearing
  },
};
