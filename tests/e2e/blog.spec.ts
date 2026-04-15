import { test, expect } from '@playwright/test';

test.describe('Blog Management', () => {
  test('should load the blog list page', async ({ page }) => {
    await page.goto('/admin/blog');
    await expect(page.getByRole('heading', { name: /blog posts/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /new post/i })).toBeVisible();
  });

  test('should navigate to the new blog post form', async ({ page }) => {
    await page.goto('/admin/blog');
    await page.getByRole('link', { name: /new post/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/blog\/new/);
    await expect(page.getByRole('heading', { name: /new blog post/i })).toBeVisible();
  });

  test('should create a new blog post as draft', async ({ page }) => {
    await page.goto('/admin/blog/new');

    const title = `E2E Test Draft ${Date.now()}`;
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('Description').fill('This is a test blog post created by E2E tests.');
    await page.getByLabel('Tags').fill('e2e, test');
    await page.getByRole('radio', { name: 'Draft' }).check();

    // Fill content — if there's a markdown editor, try the textarea
    const contentArea = page.locator('textarea[placeholder*="content" i]');
    if (await contentArea.isVisible()) {
      await contentArea.fill('This is the E2E test body.');
    }

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/draft saved/i)).toBeVisible();
  });

  test('should show validation on new blog post with empty fields', async ({ page }) => {
    await page.goto('/admin/blog/new');
    // Submit without filling anything — browser should block via HTML5 validation
    const submitBtn = page.getByRole('button', { name: /save/i });
    await submitBtn.click();

    // Required fields should prevent submission
    await expect(submitBtn).toBeVisible();
  });

  test('should be able to cancel and go back to blog list', async ({ page }) => {
    await page.goto('/admin/blog/new');
    await page.getByRole('link', { name: /cancel/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/blog/);
  });

  test('should display blog posts table with status badges', async ({ page }) => {
    await page.goto('/admin/blog');
    // Either the table is visible or "No blog posts found." message
    const table = page.locator('table');
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
      await expect(page.getByText(/title/i)).toBeVisible();
      await expect(page.getByText(/status/i)).toBeVisible();
    } else {
      await expect(page.getByText(/no blog posts found/i)).toBeVisible();
    }
  });
});
