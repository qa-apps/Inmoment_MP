import { test, expect } from '../src/fixtures/test';

// Resources → Podcast navigation and soft content checks

test.describe('Podcast navigation', () => {
  test('navigates to Podcast and checks content markers', async ({ page, gotoHome, resourcesPage }) => {
    await gotoHome();
    await resourcesPage.gotoPodcast();

    await expect(page).toHaveTitle(/podcast|inmoment|blog/i);

    // Soft content checks
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible({ timeout: 10000 });

    // Check for either audio or episodes/articles
    const content = page.locator('audio').or(resourcesPage.article).or(page.locator('[class*="episode" i]'));
    await expect.soft(content.first()).toBeVisible({ timeout: 10000 });
  });

  test('podcast page exposes episodes list or audio player', async ({ page, gotoHome, resourcesPage }) => {
    await gotoHome();
    await resourcesPage.gotoPodcast();

    await expect(page).toHaveTitle(/podcast|inmoment/i);
    const content = page.locator('audio').or(resourcesPage.article).or(page.locator('[class*="episode" i]'));
    await expect.soft(content.first()).toBeVisible({ timeout: 10000 });
  });
});
