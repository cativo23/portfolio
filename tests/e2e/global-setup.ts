import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use?.baseURL || 'http://localhost:3000';
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const email = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.TEST_ADMIN_PASSWORD || 'password';

  // Perform login via API — the server sets the httpOnly admin_token cookie
  const response = await page.request.post(`${baseURL}/api/admin/login`, {
    data: { email, password },
  });

  const body = await response.json();

  if (response.status() !== 200 || body.status !== 'success') {
    await browser.close();
    throw new Error(
      `Login API failed with status ${response.status()}. Body: ${JSON.stringify(body)}. ` +
      'E2E authenticated tests require valid auth state. Set TEST_ADMIN_EMAIL/PASSWORD env vars.'
    );
  } else {
    // Save cookies (includes the httpOnly admin_token) to auth file
    const authDir = path.dirname('tests/e2e/.auth/admin.json');
    await page.context().storageState({ path: 'tests/e2e/.auth/admin.json' });
    console.log('Auth state saved.');
  }

  await browser.close();
}

export default globalSetup;
