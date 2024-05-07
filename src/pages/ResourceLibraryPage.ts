import { Page, Locator, expect } from '@playwright/test';

export class ResourceLibraryPage {
  readonly page: Page;
  readonly searchInput: Locator;

  /**
   * Constructs a ResourceLibraryPage.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByLabel(/search/i).or(page.getByPlaceholder(/search/i)).or(page.locator('input[type="search"]'));
  }

  /**
   * Opens Resources, then Resource Library via top navigation.
   * @returns {Promise<void>}
   */
  async openFromHome(): Promise<void> {
    const resources = this.page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    const rh = await resources.getAttribute('href');
    const rExpected = new URL(rh ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(rExpected)),
      resources.click()
    ]);

    const lib = this.page.getByRole('link', { name: /resource\s*library/i });
    await expect(lib).toBeVisible();
    const lh = await lib.getAttribute('href');
    const lExpected = new URL(lh ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(lExpected)),
      lib.click()
    ]);
  }

  /**
   * Performs a best-effort search in the library if a search field exists.
   * @param {string} term Search term.
   * @returns {Promise<void>}
   */
  async search(term: string): Promise<void> {
    if (await this.searchInput.count()) {
      await this.searchInput.first().fill(term);
      await this.searchInput.first().press('Enter');
    }
  }

  /**
   * Returns a resource card/article locator.
   * @returns {Locator}
   */
  card(): Locator {
    return this.page.getByRole('article').or(this.page.locator('[class*="card" i]'));
  }

  /**
   * Soft-asserts that at least one resource is visible.
   * @returns {Promise<void>}
   */
  async assertAnyVisible(): Promise<void> {
    await expect.soft(this.card().first()).toBeVisible({ timeout: 10000 });
  }
}
