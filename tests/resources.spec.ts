import { test, expect } from '../src/fixtures/test';

// Resources navigation tests: verify category links and navigations.

test.describe('Resources navigation', () => {
  test('Resources categories exist and navigate', async ({ page, gotoHome, resourcesPage }) => {
    await gotoHome();
    await resourcesPage.gotoRoot();

    // Use POM to assert key categories are present (best-effort)
    await resourcesPage.assertKeyCategoriesVisible();

    // Navigate to a few major sections via direct POM methods
    await resourcesPage.gotoBlog();
    await expect(page).toHaveTitle(/blog|inmoment/i);
    await resourcesPage.gotoEvents();
    await expect(page).toHaveTitle(/events|inmoment/i);
  });

  test('Resources page shows discoverable content and search', async ({ page, gotoHome, resourcesPage }) => {
    await gotoHome();
    await resourcesPage.gotoRoot();
    await expect(page).toHaveTitle(/resources|learn|connect|inmoment/i);

    await expect.soft(resourcesPage.searchBox.first()).toBeVisible({ timeout: 10000 });
    await expect.soft(resourcesPage.article.first()).toBeVisible({ timeout: 10000 });
  });
});
