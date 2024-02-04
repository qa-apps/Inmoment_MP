import { test, expect } from '../src/fixtures/test';
import { randomEmail, randomString, randomPhone } from '../src/utils/data';

// Request Demo flow: navigate from home, verify presence of a form,
// and attempt a benign submit with random data without expecting success.

test.describe('Request Demo', () => {
  test('opens from top nav and attempts a benign form submit', async ({ page, gotoHome }) => {
    await gotoHome();

    const request = page.getByRole('link', { name: /request\s*(a\s*)?demo/i });
    await expect(request).toBeVisible();
    const href = await request.getAttribute('href');
    expect(href).toBeTruthy();

    const expected = new URL(href!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(expected)),
      request.click()
    ]);

    // Soft-assert a form exists
    const form = page.locator('form');
    await expect.soft(form.first()).toBeVisible({ timeout: 15000 });

    // Try to fill common fields when present
    const set = async (sel: RegExp, val: string) => {
      const el = page.getByLabel(sel).or(page.getByPlaceholder(sel));
      if (await el.count()) await el.first().fill(val);
    };
    await set(/first\s*name/i, 'QA-' + randomString(6));
    await set(/last\s*name/i, randomString(7));
    await set(/email/i, randomEmail());
    await set(/company/i, 'InMoment Test');
    await set(/phone/i, randomPhone());

    // Country combo (best effort)
    const combo = page.getByRole('combobox').or(page.getByLabel(/country/i));
    if (await combo.count()) {
      await combo.first().click();
      const opt = page.getByRole('option', { name: /united states|canada|united kingdom/i });
      if (await opt.count()) await opt.first().click().catch(() => {});
    }

    // Best-effort submit
    const submit = page.getByRole('button', { name: /submit|request|demo|send/i });
    if (await submit.count()) await submit.first().click();

    // Soft-check page did not navigate to an obvious error route
    await expect.soft(page).not.toHaveURL(/error|404/i);
  });
});
