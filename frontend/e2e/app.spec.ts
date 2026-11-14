import { expect, test } from '@playwright/test';

test('the root url opens the Log in screen', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('h1')).toContainText('SpoilerAlert');
  await expect(page.locator('ion-segment-button')).toHaveCount(2);
});

test('the selector switches to Sign up', async ({ page }) => {
  await page.goto('/login');
  await page.locator('ion-segment-button[value="signup"]').click();
  await expect(page.locator('h1')).toContainText('Create your profile');
  await expect(page.locator('app-signup-form')).toBeVisible();
});
