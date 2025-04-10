import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class LogInPage extends BasePage {
  readonly page: Page;
  readonly url: string;
  readonly loginButton: Locator;
  readonly passwordInputField: Locator;
  readonly elementWithText: (text: string) => Locator;

  constructor(page: Page) {
    super(page, '/sessions/new')
    this.page = page;
    this.elementWithText = (text) => page.getByText(text);
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.passwordInputField = page.getByRole('textbox', { name: 'token' });
  }

  async logIn(password: string) {
    await this.passwordInputField.fill(password);
    await this.loginButton.click();
  }
}
