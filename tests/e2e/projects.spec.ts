import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test('should load the projects list page', async ({ page }) => {
    await page.goto('/admin/projects');
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /new project/i })).toBeVisible();
  });

  test('should navigate to the new project form', async ({ page }) => {
    await page.goto('/admin/projects');
    await page.getByRole('link', { name: /new project/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/projects\/new/);
    await expect(page.getByRole('heading', { name: /new project/i })).toBeVisible();
  });

  test('should create a new project', async ({ page }) => {
    await page.goto('/admin/projects/new');

    const title = `E2E Test Project ${Date.now()}`;
    await page.getByLabel(/title/i).first().fill(title);
    await page.getByLabel(/short description/i).fill('A short description for the E2E test project.');
    await page.getByLabel(/description.*markdown/i).fill('Full description in **markdown** format.');
    await page.getByLabel(/tech stack/i).fill('TypeScript, Docker');
    await page.getByLabel(/status/i).selectOption('active');
    await page.getByLabel(/featured project/i).uncheck();

    await page.getByRole('button', { name: /create project/i }).click();
    await expect(page.getByText(/project created successfully/i)).toBeVisible();
  });

  test('should show validation on empty project form', async ({ page }) => {
    await page.goto('/admin/projects/new');
    await page.getByRole('button', { name: /create project/i }).click();
    // Browser required validation should prevent submission
    await expect(page.getByRole('button', { name: /create project/i })).toBeVisible();
  });

  test('should be able to cancel and go back to projects list', async ({ page }) => {
    await page.goto('/admin/projects/new');
    await page.getByRole('link', { name: /cancel/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/projects/);
  });

  test('should display projects table when projects exist', async ({ page }) => {
    await page.goto('/admin/projects');
    const table = page.locator('table');
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
      await expect(page.getByText(/title/i)).toBeVisible();
      await expect(page.getByText(/status/i)).toBeVisible();
    } else {
      await expect(page.getByText(/no projects found/i)).toBeVisible();
    }
  });
});
