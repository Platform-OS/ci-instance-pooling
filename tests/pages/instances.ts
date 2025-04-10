import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';
import { Form } from './components/form';
import { Table } from './components/table';

export class InstancesPage extends BasePage {
  readonly page: Page;
  readonly table: Table;

  constructor(page: Page) {
    super(page, '/')
    this.page = page;
    this.table = new Table(this.page);
  };

  async deleteInstance(instance: string) {
    await this.table.rowWithText(instance).getByRole('button', { name: 'OK' }).click();
  };

  async releaseInstance(instance: string) {
    await this.table.rowWithText(instance).getByRole('button', { name: 'Release' }).click();
  };

  async reserveInstance(instance: string) {
    await this.table.rowWithText(instance).getByRole('button', { name: 'Reserve' }).click();
  };
}

export class NewInstanceForm extends Form {
  readonly page: Page;
  readonly nameToLocatorMapping: { [key: string]: { type: string, locator: string } };

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.nameToLocatorMapping = {
      domain: { type: 'textbox', locator: '#domain' },
      pos_cli_token: { type: 'textbox', locator: '#pos_cli_token' }
    };
  };

  async fillInstanceData(instanceData: {
    domain?: string;
    pos_cli_token?: string;
  }) {
    await this.fill(instanceData, this.nameToLocatorMapping)
  }
}