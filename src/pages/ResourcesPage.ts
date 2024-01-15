import { Page, Locator, expect } from '@playwright/test';

export class ResourcesPage {
  readonly page: Page;

  /**
   * Constructs a ResourcesPage object.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens the Resources page from the top navigation.
   * @returns {Promise<void>}
   */
  async openFromHome(): Promise<void> {
    const link = this.page.getByRole('link', { name: /resources/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(expected)),
      link.click(),
    ]);
  }

  /**
   * Returns locator for a resources sub-link by accessible name.
   * @param {string|RegExp} name Link name.
   * @returns {Locator}
   */
  subLink(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }

  /**
   * Asserts visibility of key resources categories.
   * @returns {Promise<void>}
   */
  async assertKeyCategoriesVisible(): Promise<void> {
    const names = [
      /customer\s*stories/i,
      /events/i,
      /blog/i,
      /podcast/i,
      /calculate\s*the\s*roi/i,
      /resource\s*library/i,
      /partners/i,
    ];
    for (const n of names) {
      await expect(this.subLink(n)).toBeVisible();
    }
  }

  /**
   * Follows a resources sub-link and verifies navigation.
   * @param {string} name Link name.
   * @returns {Promise<void>}
   */
  async followAndAssert(name: string): Promise<void> {
    const link = this.subLink(new RegExp(`^${this.escape(name)}$`, 'i'));
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(expected)),
      link.click(),
    ]);
  }

  private escape(v: string): string {
    return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
