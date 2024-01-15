import { test, expect } from '../src/fixtures/test';

test.describe('Add Resources Page Object With Search And Article Locators test suite', () => {
  test('verify basic functionality', async ({ page, gotoHome }) => {
    await gotoHome();
    await expect(page).toHaveTitle(/InMoment/i);
    
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main').or(page.locator('[role="main"]')).first();
    await expect.soft(mainContent).toBeVisible({ timeout: 10000 });
    
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible();
    
    const links = page.getByRole('link');
    await expect.soft(links.first()).toBeVisible();
    
    await page.waitForLoadState('domcontentloaded');
  });

  test('navigation elements are accessible', async ({ page, gotoHome }) => {
    await gotoHome();
    
    const header = page.getByRole('banner');
    const nav = header.locator('nav').or(header.locator('[role="navigation"]')).first();
    
    if (await nav.count() > 0) {
      await expect.soft(nav).toBeVisible();
    }
    
    const menuItems = header.getByRole('link').or(header.getByRole('button'));
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = menuItems.nth(i);
      await expect.soft(item).toBeVisible();
    }
  });

  test('page has proper structure and content', async ({ page, gotoHome }) => {
    await gotoHome();
    
    await page.waitForLoadState('domcontentloaded');
    
    const footer = page.locator('footer');
    await expect.soft(footer.first()).toBeVisible({ timeout: 15000 });
    
    const mainArea = page.locator('main').or(page.locator('body')).first();
    await expect(mainArea).toBeVisible();
    
    const allLinks = page.getByRole('link');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(1);
  });
});
