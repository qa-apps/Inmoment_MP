import { test, expect } from '../src/fixtures/test';

// Platform navigation smoke tests for key areas.

test.describe('Platform navigation', () => {
  test('Platform top-level and core areas', async ({ page, gotoHome }) => {
    await gotoHome();

    const platform = page.getByRole('link', { name: /^platform$/i });
    await expect(platform).toBeVisible();
    const href = await platform.getAttribute('href');
    expect(href).toBeTruthy();
    const expected = new URL(href!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(expected)),
      platform.click()
    ]);

    const areas = [
      'Platform Overview',
      'Listen & Improve',
      'Report',
      'Mobile Application',
      'Integrations',
      'Text Analytics',
      'Artificial Intelligence',
      'Security',
      'Scalability',
    ];

    for (const name of areas) {
      const link = page.getByRole('link', { name: new RegExp(`^${name}$`, 'i') });
      await expect(link).toBeVisible();
      const subHref = await link.getAttribute('href');
      if (!subHref) continue; // not all may be navigable from overview
      const subExpected = new URL(subHref, page.url()).toString();
      await Promise.all([
        page.waitForURL(u => u.toString().startsWith(subExpected)),
        link.click()
      ]);
      await page.goto(expected);
    }
  });

  test('Platform page has discoverable content blocks', async ({ page, gotoHome }) => {
    await gotoHome();
    const platform = page.getByRole('link', { name: /^platform$/i });
    await expect(platform).toBeVisible();
    await platform.click();
    await expect(page).toHaveTitle(/platform|inmoment/i);

    // Soft-check for common content markers to avoid flakiness
    await expect.soft(page.getByRole('heading', { name: /report/i })).toBeVisible({ timeout: 10000 });
    await expect.soft(page.getByRole('heading', { name: /mobile/i })).toBeVisible({ timeout: 10000 });
  });
});
