import { test as setup } from '@playwright/test';
import process from 'process';
import { LogInPage } from './pages/login';
import { users } from './data/users';

const PASSWORD = process.env.E2E_TEST_PASSWORD;
if (!PASSWORD) {
  throw new Error('E2E_TEST_PASSWORD environment variable is not set');
}

const usersToAuth = [users.test1, users.test2, users.test3];

for (const user of usersToAuth) {
  setup(`authenticate ${user.email}`, async ({ page }) => {
    const loginPage = new LogInPage(page);
  
    await loginPage.goto();
    await loginPage.logIn(user.email, PASSWORD);

    await page.getByText('Logged in as').waitFor();
    await page.context().storageState({ path: `tests/.auth/${user.email}.json` });
  });
}