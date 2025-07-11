import { BrowserContext, expect, test } from '@playwright/test';
import { RegistrationPage } from './pages/registration';
import { InstancesPage } from './pages/instances'
import process from 'process';
import { users } from './data/users';

const PASSWORD = process.env.E2E_TEST_PASSWORD;
if (!PASSWORD) {
  throw new Error('E2E_TEST_PASSWORD environment variable is not set');
}

const TOKEN = process.env.TEST_TOKEN;
if (!TOKEN) {
  throw new Error('TEST_TOKEN environment variable is not set');
}

test.describe('Register users', () => {
  for (const dataSet of Object.values(users)) {
    test(`Register test profile for ${dataSet.email}`, async ({ page }) => {
      const signUpPage = new RegistrationPage(page);
      const instancesPage = new InstancesPage(page);
      await test.step('Navigate to the registration page', async () => {
        await signUpPage.goto();
      });
      await test.step(`Register user ${dataSet.email}`, async () => {
        await signUpPage.registerUser(
          { firstName: dataSet.firstName, lastName: dataSet.lastName, email: dataSet.email },
          PASSWORD, TOKEN
        );
        expect(instancesPage.headingWithText('pooling results')).toBeVisible();
        await page.context().storageState({ path: `tests/.auth/${dataSet.email}.json` });
      });
    });
  }
});