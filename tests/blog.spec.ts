import { test, expect } from '../src/fixtures/test';

// Resources → Blog navigation and soft content checks

test.describe('Blog navigation', () => {
  test('navigates to Blog and checks content markers', async ({ page, gotoHome, resourcesPage }) => {
    await gotoHome();
    await resourcesPage.gotoBlog();

    await expect(page).toHaveTitle(/blog|inmoment/i);

    // Soft content checks (avoid flakiness across content updates)
    await expect.soft(resourcesPage.searchBox).toBeVisible({ timeout: 10000 });

    await expect.soft(resourcesPage.article).toBeVisible({ timeout: 10000 });

    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible({ timeout: 10000 });
  });

  test('blog page exposes search and at least one article teaser', async ({ page, gotoHome, resourcesPage }) => {
    await gotoHome();
    await resourcesPage.gotoBlog();

    await expect(page).toHaveTitle(/blog|inmoment/i);

    await expect.soft(resourcesPage.searchBox).toBeVisible({ timeout: 10000 });

    await expect.soft(resourcesPage.article).toBeVisible({ timeout: 10000 });
  });
});
