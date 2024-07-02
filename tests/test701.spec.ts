import { test, expect } from '../src/fixtures/test';
test.describe('Guard Solutions Links With Best Effort Assertions', () => {
  test('check one', async ({ page, gotoHome }) => {
    await gotoHome();
    await expect(page).toHaveTitle(/InMoment/i);
    await page.waitForLoadState('domcontentloaded');
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
  });
  test('check two', async ({ page, gotoHome }) => {
    await gotoHome();
    const links = page.getByRole('link');
    await expect(links.first()).toBeVisible();
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible();
  });
  test('check three', async ({ page, gotoHome }) => {
    await gotoHome();
    const main = page.locator('main, [role="main"]').first();
    await expect.soft(main).toBeVisible();
    const footer = page.locator('footer');
    await expect.soft(footer.first()).toBeVisible({ timeout: 15000 });
  });
});
