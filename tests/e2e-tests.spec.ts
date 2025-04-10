import { test, expect } from '@playwright/test';
import { InstancesPage, NewInstanceForm } from './pages/instances'
import { LogInPage } from './pages/login'

import { instances } from './data/instances';

const PASSWORD = process.env.TEST_TOKEN;

test.describe('Log In tests', () => {
  test('should log in using correct password', async ({ page }) => {
    const loginPage = new LogInPage(page);

    await loginPage.goto();
    await loginPage.logIn(PASSWORD);

    await expect(page.getByText('pooling results of')).toBeVisible();
  });

  test('should log out successfully', async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user2.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const loginPage = new LogInPage(page);

    await instancesPage.goto();
    await instancesPage.buttonWithText('Log out').click();

    await expect(loginPage.headingWithText('Authentication')).toBeVisible();
  });

  test(`should not log in with invalid token`, async ({ page }) => {
    const loginPage = new LogInPage(page);

    await loginPage.goto();
    await loginPage.logIn('wrongtoken');

    await expect(loginPage.page.getByText('not authorized')).toBeVisible();
  }); 
});

test.describe('Reserving instances tests', () => {
  test('should reserve an instance', async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const instanceToReserve = instances.instanceToReserve;

    await instancesPage.goto();

    await instancesPage.reserveInstance(instanceToReserve.domain);

    await expect(instancesPage.table.rowWithText(instanceToReserve.domain).getByText('reserved by admin')).toBeVisible();
  });
});

test.describe('Releasing instances tests', () => {
  test('should release a reserved instance', async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const instanceToRelease = instances.instanceToRelease;

    await instancesPage.goto();

    await instancesPage.releaseInstance(instanceToRelease.domain);
    await expect(instancesPage.table.rowWithText(instanceToRelease.domain).getByText('reserved by admin')).not.toBeVisible();
  });
});

test.describe('Deleting instances tests', () => {
  test('should delete selected instance', async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const instanceToDelete = instances.instanceToDelete

    await instancesPage.goto();
    await expect(instancesPage.table.tableRow).toHaveCount(4);

    await expect(instancesPage.table.rowWithText(instanceToDelete.domain)).toBeVisible();  
    await instancesPage.deleteInstance(instanceToDelete.domain);
    await expect(instancesPage.table.rowWithText(instanceToDelete.domain)).not.toBeVisible();

    await expect(instancesPage.table.tableRow).toHaveCount(3);
  });
});

test.describe('Reserve by API', () => {
  test(`should reserve instance via API`, async ({ browser, request }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const instanceReservedByApi = instances.instanceReservedByApi;

    const response = await request.post("/api/instances/reserve", {
        headers: {
            "Authorization": `Bearer ${PASSWORD}`,
            "Content-type": "application/json", 
        },
        data: {
            "client": "ORG-name--projectName--jobId--prId",
        }
    });

    await instancesPage.goto();
    await expect(instancesPage.table.rowWithText(instanceReservedByApi.domain).getByText(instanceReservedByApi.reservedByUrl)).toBeVisible();
  });

  test('should release instance reserved via API', async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const instanceReservedByApi = instances.instanceReservedByApi;

    await instancesPage.goto();

    await instancesPage.releaseInstance(instanceReservedByApi.domain);
    await expect(instancesPage.table.rowWithText(instanceReservedByApi.domain).getByText(instanceReservedByApi.reservedByUrl)).not.toBeVisible();
  });
});

test.describe('Creating instances tests', () => {
  test('should create an instance', async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const newInstanceForm = new NewInstanceForm(page);
    const instanceToCreate = instances.instanceToCreate;
    const domainName = instanceToCreate.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    await instancesPage.goto();
    await instancesPage.buttonWithText('Add +').click();

    await expect(newInstanceForm.headingWithText('Add instance to pooling')).toBeVisible();
    await newInstanceForm.fillInstanceData(instanceToCreate);
    await newInstanceForm.submitButton('Confirm').click();

    await expect(instancesPage.table.rowWithText(domainName)).toBeVisible();  
  });

  test(`should'nt create an instance with existing domain`, async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const newInstanceForm = new NewInstanceForm(page);
    const instanceToCreate = instances.instanceToCreate;

    await instancesPage.goto();
    await instancesPage.buttonWithText('Add +').click();

    await newInstanceForm.fillInstanceData(instanceToCreate);
    await newInstanceForm.submitButton('Confirm').click();

    await expect(newInstanceForm.fieldValidationError('Domain', 'Error(s): already taken')).toBeVisible();
  });

  test(`should'nt create an instance with invalid domain`, async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const newInstanceForm = new NewInstanceForm(page);
    const instanceToCreate = instances.instanceWithInvalidDomain;

    await instancesPage.goto();
    await instancesPage.buttonWithText('Add +').click();

    await newInstanceForm.fillInstanceData(instanceToCreate);
    await newInstanceForm.submitButton('Confirm').click();

    await expect(newInstanceForm.fieldValidationError('Domain', 'Error(s): is not valid url')).toBeVisible();
  });

  test(`should'nt create an instance with weak token`, async ({ browser }) => {
    const context = await browser.newContext({ storageState: `tests/.auth/user1.json` });
    const page = await context.newPage();
    const instancesPage = new InstancesPage(page);
    const newInstanceForm = new NewInstanceForm(page);
    const instanceToCreate = instances.instanceWithWeakToken;

    await instancesPage.goto();
    await instancesPage.buttonWithText('Add +').click();

    await newInstanceForm.fillInstanceData(instanceToCreate);
    await newInstanceForm.submitButton('Confirm').click();

    await expect(newInstanceForm.fieldValidationError('pos_cli_token', 'Error(s): is too short (minimum is 43 characters)')).toBeVisible();
  });
});

