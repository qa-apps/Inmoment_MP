import { test, expect } from '../src/fixtures/test';

test.describe('Homepage navigation and verification', () => {
  test('homepage loads with correct title and header elements', async ({ page, gotoHome }) => {
    await gotoHome();
    
    await expect(page).toHaveTitle(/InMoment|Customer Experience/i);
    
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    
    const solutionsLink = header.getByRole('link', { name: /solutions/i }).or(
      header.getByRole('button', { name: /solutions/i })
    ).first();
    await expect(solutionsLink).toBeVisible();
    
    const platformLink = header.getByRole('link', { name: /platform/i }).or(
      header.getByRole('button', { name: /platform/i })
    ).first();
    await expect(platformLink).toBeVisible();
    
    const resourcesLink = header.getByRole('link', { name: /resources/i }).or(
      header.getByRole('button', { name: /resources/i })
    ).first();
    await expect(resourcesLink).toBeVisible();
    
    const partnersLink = header.getByRole('link', { name: /partners/i }).or(
      header.getByRole('button', { name: /partners/i })
    ).first();
    await expect(partnersLink).toBeVisible();
    
    const requestDemoButton = header.locator(':is(a,button):has-text("Request a Demo"), :is(a,button):has-text("Request Demo")').first();
    if (await requestDemoButton.count() > 0) {
      await expect.soft(requestDemoButton).toBeVisible();
    }
    
    const loginLink = header.getByRole('link', { name: /login/i }).or(
      header.getByRole('button', { name: /login/i })
    ).first();
    if (await loginLink.count() > 0) {
      await expect.soft(loginLink).toBeVisible();
    }
  });

  test('homepage has visible main content area', async ({ page, gotoHome }) => {
    await gotoHome();
    
    const main = page.locator('main').or(page.locator('[role="main"]')).first();
    await expect(main).toBeVisible();
    
    const headings = page.getByRole('heading');
    const firstHeading = headings.first();
    await expect(firstHeading).toBeVisible();
    
    const links = page.getByRole('link');
    await expect(links.first()).toBeVisible();
  });
});
