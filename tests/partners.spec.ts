import { test, expect } from '../src/fixtures/test';

// Partners page CTAs and navigation.

test.describe('Partners navigation', () => {
  test('Partners CTAs visible and navigable', async ({ page, gotoHome }) => {
    await gotoHome();

    const partners = page.getByRole('link', { name: /^partners$/i });
    await expect(partners).toBeVisible();
    const href = await partners.getAttribute('href');
    expect(href).toBeTruthy();
    const expected = new URL(href!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(expected)),
      partners.click()
    ]);

    const names = [
      /partner\s*with\s*inmoment/i,
      /become\s*a\s*partner/i,
      /find\s*a\s*partner/i,
    ];
    for (const n of names) {
      await expect(page.getByRole('link', { name: n })).toBeVisible();
    }
  });

  test('Partners page content smoke checks', async ({ page, gotoHome }) => {
    await gotoHome();
    const partners = page.getByRole('link', { name: /^partners$/i });
    await expect(partners).toBeVisible();
    await partners.click();

    await expect(page).toHaveTitle(/partners|inmoment/i);
    await expect.soft(page.getByRole('heading', { name: /partner/i })).toBeVisible({ timeout: 10000 });
    await expect.soft(page.getByRole('link', { name: /become/i })).toBeVisible({ timeout: 10000 });

    // Try following one CTA if available and return
    const become = page.getByRole('link', { name: /become/i });
    if (await become.count()) {
      const bh = await become.first().getAttribute('href');
      if (bh) {
        const bex = new URL(bh, page.url()).toString();
        await Promise.all([
          page.waitForURL(u => u.toString().startsWith(bex)),
          become.first().click()
        ]);
        await page.goBack();
      }
    }
  });
});
