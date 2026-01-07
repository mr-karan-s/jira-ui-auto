const BasePage = require('./BasePage');
const FormInputComponent = require('./components/FormInputComponent');
const NavigationComponent = require('./components/NavigationComponent');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Initialize components for login form
    this.emailInput = new FormInputComponent(page, '#username');
    this.passwordInput = new FormInputComponent(page, '#password');
    this.loginButton = new NavigationComponent(page, '#login-submit');
  }

  async login(email, password) {
    // Navigate to Jira login page
    await this.navigate(process.env.JIRA_URL);

    // Enter email and submit
    await this.emailInput.fill(email);
    await this.loginButton.click();

    // Enter password and submit
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
