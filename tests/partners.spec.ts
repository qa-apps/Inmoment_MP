import { test, expect } from '../src/fixtures/test';

// Partners page CTAs and navigation.

test.describe('Partners navigation', () => {
  test('Partners CTAs visible and navigable', async ({ page, gotoHome, partnersPage }) => {
    await gotoHome();
    await partnersPage.openFromHome();

    await partnersPage.assertKeyCtasVisible();
  });

  test('Partners page content smoke checks', async ({ page, gotoHome, partnersPage }) => {
    await gotoHome();
    await partnersPage.openFromHome();

    await expect(page).toHaveTitle(/partners|inmoment/i);
    await expect.soft(page.getByRole('heading', { name: /partner/i }).first()).toBeVisible({ timeout: 10000 });
    
    // Try following one CTA if available and return
    const become = partnersPage.link(/become/i).first();
    if (await become.count() && await become.isVisible()) {
      const bh = await become.getAttribute('href');
      if (bh) {
        const bex = new URL(bh, page.url()).toString();
        await page.goto(bex);
        await page.goBack();
      }
    }
  });
});
