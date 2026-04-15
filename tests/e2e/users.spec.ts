import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test('should load the users list page', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new user/i })).toBeVisible();
  });

  test('should display users table when users exist', async ({ page }) => {
    await page.goto('/admin/users');
    const table = page.locator('table');
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
      await expect(page.getByText(/username/i)).toBeVisible();
      await expect(page.getByText(/email/i)).toBeVisible();
      await expect(page.getByText(/role/i)).toBeVisible();
    } else {
      await expect(page.getByText(/no users found/i)).toBeVisible();
    }
  });

  test('should open create user modal', async ({ page }) => {
    await page.goto('/admin/users');
    await page.getByRole('button', { name: /new user/i }).click();
    await expect(page.getByRole('heading', { name: /new user/i })).toBeVisible();
    await expect(page.locator('input[placeholder="username"]')).toBeVisible();
    await expect(page.locator('input[placeholder="user@example.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="min 6 chars"]')).toBeVisible();
  });

  test('should create a new user', async ({ page }) => {
    await page.goto('/admin/users');
    const username = `e2etest${Date.now()}`;

    await page.getByRole('button', { name: /new user/i }).click();
    await page.locator('input[placeholder="username"]').fill(username);
    await page.locator('input[placeholder="user@example.com"]').fill(`${username}@example.com`);
    await page.locator('input[placeholder="min 6 chars"]').fill('testpass123');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText(/user created/i)).toBeVisible();
  });

  test('should open edit user modal', async ({ page }) => {
    await page.goto('/admin/users');
    // Wait for users table or empty state to appear before interacting
    await page.locator('table, :text-matches("no users found", "i")').first().waitFor({ state: 'visible' });

    const editBtn = page.getByRole('button', { name: /edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByRole('heading', { name: /edit user/i })).toBeVisible();
    }
  });

  test('should cancel user creation from modal', async ({ page }) => {
    await page.goto('/admin/users');
    await page.getByRole('button', { name: /new user/i }).click();
    await page.getByRole('button', { name: /cancel/i }).click();

    // Modal should be closed — "new user" heading should disappear
    await expect(page.getByRole('heading', { name: /new user/i })).not.toBeVisible();
  });
});
