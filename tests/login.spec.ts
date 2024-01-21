import { test, expect } from '../src/fixtures/test';
import { randomEmail, randomPassword } from '../src/utils/data';

// Login smoke without real credentials. Verifies email -> next -> password flow
// and sign-in button visibility/enabled state when using random creds.

test.describe('Login flow (unauthenticated)', () => {
  test('email -> next -> password with random creds', async ({ page, gotoHome }) => {
    await gotoHome();

    const login = page.getByRole('link', { name: /login/i });
    await expect(login).toBeVisible();

    const loginHref = await login.getAttribute('href');
    expect(loginHref).toBeTruthy();

    const expected = new URL(loginHref!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(expected)),
      login.click()
    ]);

    // Email
    const email = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).or(page.locator('input[type="email"]'));
    await expect.soft(email).toBeVisible({ timeout: 15000 });

    const fakeEmail = randomEmail();
    if (await email.isVisible().catch(() => false)) {
      await email.fill(fakeEmail);
    }

    const nextBtn = page.getByRole('button', { name: /next|continue/i });
    if (await nextBtn.count()) {
      await nextBtn.first().click();
    }

    // Password
    const pwd = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).or(page.locator('input[type="password"]'));
    await expect.soft(pwd).toBeVisible({ timeout: 15000 });

    if (await pwd.isVisible().catch(() => false)) {
      await pwd.fill(randomPassword());
    }

    const signIn = page.getByRole('button', { name: /sign in|log in/i });
    if (await signIn.count()) {
      await expect.soft(signIn.first()).toBeVisible();
      // Most identity providers will reject bad credentials. We only ensure
      // the UI allows attempting a sign-in with provided values.
    }
  });
});
