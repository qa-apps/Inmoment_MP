import { test, expect } from '../src/fixtures/test';
test.describe('Add Href Based Navigation Helper In Home Page', () => {
  test('scenario one', async ({ page, gotoHome }) => {
    await gotoHome();
    await expect(page).toHaveTitle(/InMoment/i);
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    const links = page.getByRole('link');
    await expect(links.first()).toBeVisible();
  });
  test('scenario two', async ({ page, gotoHome }) => {
    await gotoHome();
    const main = page.locator('main, [role="main"]').first();
    await expect.soft(main).toBeVisible();
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible();
  });
  test('scenario three', async ({ page, gotoHome }) => {
    await gotoHome();
    await page.waitForLoadState('domcontentloaded');
    const footer = page.locator('footer');
    await expect.soft(footer.first()).toBeVisible({ timeout: 15000 });
  });
});
