import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test.describe('Public access', () => {
    // These tests should NOT use the stored auth state
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should load the login page', async ({ page }) => {
      await page.goto('/admin/login');
      await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('should protect the admin dashboard', async ({ page }) => {
      await page.goto('/admin');
      await expect(page).toHaveURL(/.*\/admin\/login/);
    });

    test('should protect admin blog management', async ({ page }) => {
      await page.goto('/admin/blog');
      await expect(page).toHaveURL(/.*\/admin\/login/);
    });

    test('should protect admin projects management', async ({ page }) => {
      await page.goto('/admin/projects');
      await expect(page).toHaveURL(/.*\/admin\/login/);
    });

    test('should protect admin users management', async ({ page }) => {
      await page.goto('/admin/users');
      await expect(page).toHaveURL(/.*\/admin\/login/);
    });

    test('should reject login with invalid credentials', async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel(/email/i).fill('wrong@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    });
  });

  test.describe('Authenticated access', () => {
    test('should redirect authenticated user from login to dashboard', async ({ page }) => {
      await page.goto('/admin/login');
      await expect(page).toHaveURL(/.*\/admin(\/.*)?/);
    });

    test('should load admin dashboard when authenticated', async ({ page }) => {
      await page.goto('/admin');
      await expect(page).toHaveURL(/.*\/admin/);
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    });

    test('should navigate to blog management from dashboard', async ({ page }) => {
      await page.goto('/admin');
      await page.getByRole('link', { name: /write new post/i }).click();
      await expect(page).toHaveURL(/.*\/admin\/blog\/new/);
    });

    test('should navigate to project management from dashboard', async ({ page }) => {
      await page.goto('/admin');
      await page.getByRole('link', { name: /add new project/i }).click();
      await expect(page).toHaveURL(/.*\/admin\/projects\/new/);
    });
  });
});
