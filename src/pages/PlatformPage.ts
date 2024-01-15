import { Page, Locator, expect } from '@playwright/test';

export class PlatformPage {
  readonly page: Page;

  /**
   * Constructs a PlatformPage object.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens the Platform page from the top navigation.
   * @returns {Promise<void>}
   */
  async openFromHome(): Promise<void> {
    const link = this.page.getByRole('link', { name: /platform/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(expected)),
      link.click(),
    ]);
  }

  /**
   * Returns locator for a platform sub-link by accessible name.
   * @param {string|RegExp} name Link name.
   * @returns {Locator}
   */
  subLink(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }

  /**
   * Asserts visibility of common platform areas.
   * @returns {Promise<void>}
   */
  async assertKeyAreasVisible(): Promise<void> {
    const names = [
      /platform\s*overview/i,
      /listen\s*&\s*improve/i,
      /report/i,
      /mobile\s*application/i,
      /integrations?/i,
      /text\s*analytics/i,
      /artificial\s*intelligence/i,
      /security/i,
      /scalability/i,
    ];
    for (const n of names) {
      await expect(this.subLink(n)).toBeVisible();
    }
  }

  /**
   * Follows a platform sub-link and verifies navigation.
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
