import { test, expect } from '../src/fixtures/test';
test.describe('Remove Hard Waits And Use Expect Where Needed', () => {
  test('validation one', async ({ page, gotoHome }) => {
    await gotoHome();
    await expect(page).toHaveTitle(/InMoment/i);
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    await page.waitForLoadState('domcontentloaded');
  });
  test('validation two', async ({ page, gotoHome }) => {
    await gotoHome();
    const links = page.getByRole('link');
    await expect(links.first()).toBeVisible();
    const main = page.locator('main, [role="main"]').first();
    await expect.soft(main).toBeVisible();
  });
  test('validation three', async ({ page, gotoHome }) => {
    await gotoHome();
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible();
    const footer = page.locator('footer');
    await expect.soft(footer.first()).toBeVisible({ timeout: 15000 });
  });
});
