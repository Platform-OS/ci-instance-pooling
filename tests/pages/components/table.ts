import { type Locator, type Page } from '@playwright/test';

export class Table {
  readonly page: Page;
  readonly table: Locator;
  readonly tableRow: Locator;
  readonly tableCell: Locator;
  readonly cellWithText: (text: string) => Locator;
  readonly rowWithText: (text: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = this.page.locator('table');
    this.tableRow = this.table.locator('tbody tr');
    this.tableCell = this.tableRow.locator('td');
    this.rowWithText = (text: string) => this.tableRow.getByText(text).locator('../..');
    this.cellWithText = (text: string) => this.tableCell.getByText(text).locator('..');
  };
};
