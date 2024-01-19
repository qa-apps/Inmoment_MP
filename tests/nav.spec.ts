import { test, expect } from '../src/fixtures/test';

test.describe('Top navigation', () => {
  test('navigates via main menu items (Solutions, Platform, Resources, Partners)', async ({ page, gotoHome }) => {
    await gotoHome();
    const topMenus = ['Solutions', 'Platform', 'Resources', 'Partners'];
    for (const name of topMenus) {
      const link = page.getByRole('link', { name: new RegExp(`^${name}$`, 'i') });
      await expect(link).toBeVisible();

      const href = await link.getAttribute('href');
      expect(href, `${name} link should have href`).toBeTruthy();

      const expected = new URL(href!, page.url()).toString();
      await Promise.all([
        page.waitForURL(url => url.toString().startsWith(expected)),
        link.click()
      ]);

      await expect(page).toHaveTitle(new RegExp(`${name}|InMoment`, 'i'));
      await page.goto('/');
    }
  });

  test('request demo navigates and login page shows auth UI elements', async ({ page, gotoHome }) => {
    await gotoHome();
    // Request Demo
    const requestDemo = page.getByRole('link', { name: /request\s*(a\s*)?demo/i });
    await expect(requestDemo).toBeVisible();
    const demoHref = await requestDemo.getAttribute('href');
    expect(demoHref).toBeTruthy();
    const demoExpected = new URL(demoHref!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(demoExpected)),
      requestDemo.click()
    ]);
    // Return home for login test
    await page.goto('/');
    // Login
    const login = page.getByRole('link', { name: /login/i });
    await expect(login).toBeVisible();
    const loginHref = await login.getAttribute('href');
    expect(loginHref).toBeTruthy();
    const loginExpected = new URL(loginHref!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(loginExpected)),
      login.click()
    ]);

    // Try to detect email field and Next/Continue flow without real creds
    const email = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).or(page.locator('input[type="email"]'));
    await expect.soft(email).toBeVisible({ timeout: 10000 });

    if (await email.isVisible().catch(() => false)) {
      await email.fill(`qa.${Date.now().toString(36)}@example.com`);
      const nextBtn = page.getByRole('button', { name: /next|continue/i });
      if (await nextBtn.count()) {
        await nextBtn.first().click();
      }

      const pwd = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).or(page.locator('input[type="password"]'));
      await expect.soft(pwd).toBeVisible({ timeout: 10000 });
      if (await pwd.isVisible().catch(() => false)) {
        await pwd.fill('Xy!2' + Math.random().toString(36).slice(2, 10));
        const signIn = page.getByRole('button', { name: /sign in|log in/i });
        await expect.soft(signIn.first()).toBeVisible();
        // Most IdPs will reject bad creds; we just ensure the UI allows attempting.
      }
    }
  });
});
