import { test, expect } from '../src/fixtures/test';

// Resources → Podcast navigation and soft content checks

test.describe('Podcast navigation', () => {
  test('navigates from Resources to Podcast and checks content markers', async ({ page, gotoHome }) => {
    await gotoHome();

    // Open Resources
    const resources = page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    const rh = await resources.getAttribute('href');
    expect(rh).toBeTruthy();
    const rExpected = new URL(rh!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(rExpected)),
      resources.click()
    ]);

    // Click Podcast
    const podcast = page.getByRole('link', { name: /podcast/i });
    await expect(podcast).toBeVisible();
    const ph = await podcast.getAttribute('href');
    expect(ph).toBeTruthy();
    const pExpected = new URL(ph!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(pExpected)),
      podcast.click()
    ]);

    await expect(page).toHaveTitle(/podcast|inmoment/i);

    // Soft content checks
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible({ timeout: 10000 });

    const audio = page.locator('audio');
    await expect.soft(audio.first()).toBeVisible({ timeout: 10000 });

    const episodes = page.getByRole('article').or(page.locator('[class*="episode" i]'));
    await expect.soft(episodes.first()).toBeVisible({ timeout: 10000 });
  });

  test('podcast page exposes episodes list or audio player', async ({ page, gotoHome }) => {
    await gotoHome();
    const resources = page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    await resources.click();
    const podcast = page.getByRole('link', { name: /podcast/i });
    await expect(podcast).toBeVisible();
    await podcast.click();

    await expect(page).toHaveTitle(/podcast|inmoment/i);
    const audio = page.locator('audio');
    await expect.soft(audio.first()).toBeVisible({ timeout: 10000 });
    const list = page.getByRole('article').or(page.locator('[class*="episode" i]'));
    await expect.soft(list.first()).toBeVisible({ timeout: 10000 });
  });
});
