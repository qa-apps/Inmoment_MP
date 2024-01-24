import { test, expect } from '../src/fixtures/test';

// Resources navigation tests: verify category links and navigations.

test.describe('Resources navigation', () => {
  test('Resources categories exist and navigate', async ({ page, gotoHome }) => {
    await gotoHome();

    const resources = page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    const href = await resources.getAttribute('href');
    expect(href).toBeTruthy();
    const expected = new URL(href!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(expected)),
      resources.click()
    ]);

    const cats = [
      'Customer Stories',
      'Events',
      'Blog',
      'Podcast',
      'Calculate the ROI',
      'Resource Library',
      'Partners',
    ];

    for (const name of cats) {
      const link = page.getByRole('link', { name: new RegExp(name, 'i') });
      await expect(link).toBeVisible();
      const lh = await link.getAttribute('href');
      if (!lh) continue;
      const lexp = new URL(lh, page.url()).toString();
      await Promise.all([
        page.waitForURL(u => u.toString().startsWith(lexp)),
        link.click()
      ]);
      await page.goto(expected);
    }
  });

  test('Resources page shows discoverable content and search', async ({ page, gotoHome }) => {
    await gotoHome();
    const resources = page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    await resources.click();

    await expect(page).toHaveTitle(/resources|inmoment/i);

    // Soft assertions to avoid flakiness across content refreshes
    await expect.soft(page.getByRole('heading', { name: /customer stories/i })).toBeVisible({ timeout: 10000 });
    await expect.soft(page.getByRole('heading', { name: /blog/i })).toBeVisible({ timeout: 10000 });
    await expect.soft(page.getByRole('heading', { name: /events/i })).toBeVisible({ timeout: 10000 });

    const search = page.getByLabel(/search/i).or(page.getByPlaceholder(/search/i)).or(page.locator('input[type="search"]'));
    await expect.soft(search).toBeVisible({ timeout: 10000 });
  });
});
