class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators (kept private to this page)
    this.emailInput = '#username';
    this.passwordInput = '#password';
    this.loginButton = '#login-submit';
  }

  async login(email, password) {
    // Navigate to Jira login page
    await this.page.goto(process.env.JIRA_URL);

    // Enter email and submit
    await this.page.fill(this.emailInput, email);
    await this.page.click(this.loginButton);

    // Enter password and submit
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}

module.exports = { LoginPage };
