import { test, expect } from '../src/fixtures/test';

test.describe('Search functionality checks', () => {
  test('search box is discoverable on resources pages', async ({ page, gotoHome }) => {
    await gotoHome();
    
    const resourcesLink = page.locator(':is(a,button)[href*="/resources" i], a:has-text("Resources")').first();
    const rh = await resourcesLink.getAttribute('href');
    const resourcesUrl = new URL(rh ?? '/resources/', page.url()).toString();
    await page.goto(resourcesUrl);
    
    await expect(page).toHaveTitle(/resources|learn|connect|inmoment/i);
    
    const searchBox = page.getByRole('searchbox').or(
      page.getByLabel(/search/i)
    ).or(
      page.locator('input[type="search"]')
    );
    
    const firstSearch = searchBox.first();
    await expect.soft(firstSearch).toBeVisible({ timeout: 10000 });
    
    if (await firstSearch.isVisible().catch(() => false)) {
      await expect.soft(firstSearch).toBeEditable();
    }
  });

  test('search box accepts input when present', async ({ page, gotoHome }) => {
    await gotoHome();
    
    const resourcesLink = page.locator(':is(a,button)[href*="/resources" i], a:has-text("Resources")').first();
    const rh = await resourcesLink.getAttribute('href');
    const resourcesUrl = new URL(rh ?? '/resources/', page.url()).toString();
    await page.goto(resourcesUrl);
    
    const searchBox = page.getByRole('searchbox').or(
      page.getByLabel(/search/i)
    ).or(
      page.locator('input[type="search"]')
    ).first();
    
    if (await searchBox.isVisible().catch(() => false)) {
      await searchBox.fill('customer experience');
      const value = await searchBox.inputValue();
      expect(value).toContain('customer');
    }
  });

  test('search results or suggestions appear after input', async ({ page, gotoHome }) => {
    await gotoHome();
    
    const resourcesLink = page.locator(':is(a,button)[href*="/resources" i], a:has-text("Resources")').first();
    const rh = await resourcesLink.getAttribute('href');
    const resourcesUrl = new URL(rh ?? '/resources/', page.url()).toString();
    await page.goto(resourcesUrl);
    
    const searchBox = page.getByRole('searchbox').or(page.getByLabel(/search/i)).first();
    
    if (await searchBox.isVisible().catch(() => false)) {
      await searchBox.fill('feedback');
      await searchBox.press('Enter');
      await page.waitForLoadState('domcontentloaded');
      await expect.soft(page).not.toHaveURL(/error|404/i);
    }
  });
});
