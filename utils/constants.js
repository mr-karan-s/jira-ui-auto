module.exports = {
  OPEN_STATUSES: ['Open', 'To Do', 'In Progress'],
  CLOSED_STATUSES: ['Done', 'Closed'],
  
  // JQL query patterns for validation
  OPEN_STATUSES_JQL_PATTERN: /status\s*=\s*"?(?:Open|To Do|In Progress)"?/i,
  CLOSED_STATUSES_JQL_PATTERN: /status\s*=\s*"?(?:Done|Closed)"?/i,
};
