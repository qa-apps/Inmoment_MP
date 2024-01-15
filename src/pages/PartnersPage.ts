import { Page, Locator, expect } from '@playwright/test';

export class PartnersPage {
  readonly page: Page;

  /**
   * Constructs a PartnersPage object.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens the Partners page from the top navigation.
   * @returns {Promise<void>}
   */
  async openFromHome(): Promise<void> {
    const link = this.page.getByRole('link', { name: /partners/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(expected)),
      link.click(),
    ]);
  }

  /**
   * Returns locator for a partner CTA/link by accessible name.
   * @param {string|RegExp} name Name of the link.
   * @returns {Locator}
   */
  link(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }

  /**
   * Asserts that key partner CTAs are visible.
   * @returns {Promise<void>}
   */
  async assertKeyCtasVisible(): Promise<void> {
    const names = [
      /partner\s*with\s*inmoment/i,
      /become\s*a\s*partner/i,
      /find\s*a\s*partner/i,
    ];
    for (const n of names) {
      await expect(this.link(n)).toBeVisible();
    }
  }

  /**
   * Follows a partner link and verifies URL begins with its href.
   * @param {string} name Link text.
   * @returns {Promise<void>}
   */
  async followAndAssert(name: string): Promise<void> {
    const link = this.link(new RegExp(`^${this.escape(name)}$`, 'i'));
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
