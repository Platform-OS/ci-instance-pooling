import { expect, test } from "playwright/test";

test.describe('Simple test', () => {
    test('simple test', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByText('Authentication')).toBeVisible();
    })
});
