import { test, expect } from '../src/fixtures/test';

// Resources → Blog navigation and soft content checks

test.describe('Blog navigation', () => {
  test('navigates from Resources to Blog and checks content markers', async ({ page, gotoHome }) => {
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

    // Click Blog
    const blog = page.getByRole('link', { name: /^blog$/i });
    await expect(blog).toBeVisible();
    const bh = await blog.getAttribute('href');
    expect(bh).toBeTruthy();
    const bExpected = new URL(bh!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(bExpected)),
      blog.click()
    ]);

    await expect(page).toHaveTitle(/blog|inmoment/i);

    // Soft content checks (avoid flakiness across content updates)
    const search = page.getByLabel(/search/i).or(page.getByPlaceholder(/search/i)).or(page.locator('input[type="search"]'));
    await expect.soft(search).toBeVisible({ timeout: 10000 });

    const article = page.getByRole('article').first();
    await expect.soft(article).toBeVisible({ timeout: 10000 });

    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible({ timeout: 10000 });
  });

  test('blog page exposes search and at least one article teaser', async ({ page, gotoHome }) => {
    await gotoHome();
    const resources = page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    await resources.click();
    const blog = page.getByRole('link', { name: /^blog$/i });
    await expect(blog).toBeVisible();
    await blog.click();

    await expect(page).toHaveTitle(/blog|inmoment/i);

    const search = page.getByLabel(/search/i).or(page.getByPlaceholder(/search/i));
    await expect.soft(search.first()).toBeVisible({ timeout: 10000 });

    const article = page.getByRole('article');
    await expect.soft(article.first()).toBeVisible({ timeout: 10000 });
  });
});
