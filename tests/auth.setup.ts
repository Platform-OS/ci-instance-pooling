import { test as setup } from '@playwright/test';
import process from 'process';
import { LogInPage } from './pages/login';

const PASSWORD = process.env.TEST_TOKEN;
if (!PASSWORD) {
  throw new Error('TEST_TOKEN environment variable is not set');
}

const users = ['user1', 'user2'];

for (const user of users) {
  setup(`authenticate ${user}`, async ({ page }) => {
    const loginPage = new LogInPage(page);
  
    await loginPage.goto();
    await loginPage.logIn(PASSWORD);
  
    await page.waitForURL('/');
    await page.context().storageState({ path: `tests/.auth/${user}.json` });
  });
}