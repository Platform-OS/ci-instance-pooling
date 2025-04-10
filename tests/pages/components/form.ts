import { type Locator, type Page } from '@playwright/test';

export class Form {
  readonly page: Page;
  readonly buttonWithText: (text: string) => Locator;
  readonly fieldValidationError: (label: string, error: string) => Locator;
  readonly headingWithText: (text: string) => Locator;
  textInputField: (text: string) => Locator;
  readonly nameToLocatorMapping: { [key: string]: { type: string, locator: string } };

  constructor(page: Page) {
    this.page = page;
    this.buttonWithText = (text: string) => page.getByRole('button', { name: text });
    this.fieldValidationError = (label: string, error: string) => page.getByLabel(label).locator('..').getByText(error);
    this.headingWithText = (text: string) => page.getByRole('heading', { name: text });
    this.textInputField = (text: string = '') => page.getByRole('textbox', { name: text });
  };

  async fill(fieldsData: { [key: string]: string | undefined }, fieldsMapping: { [key: string]: { type: string, locator: string } }) {
    for (const [key, value] of Object.entries(fieldsData)) {
      if (value !== undefined) {
        const field = fieldsMapping[key];
        await this.page.locator(field.locator).fill(value);
      }
    }
  }

  submitButton(buttonName: string) {
    return this.page.getByRole('button', { name: buttonName });
  }
};
