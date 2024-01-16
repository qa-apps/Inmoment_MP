import { Page, Locator, expect } from '@playwright/test';

export class SolutionsPage {
  readonly page: Page;

  /**
   * Constructs a SolutionsPage object.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to Solutions via the top nav link and waits for URL change.
   * @returns {Promise<void>}
   */
  async openFromHome(): Promise<void> {
    const link = this.page.getByRole('link', { name: /solutions/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(expected)),
      link.click(),
    ]);
  }

  /**
   * Returns locator for a specific Solutions sub-link by name.
   * @param {string|RegExp} name Accessible name of the link.
   * @returns {Locator}
   */
  subLink(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }

  /**
   * Asserts visible presence of key solution links.
   * @returns {Promise<void>}
   */
  async assertKeyLinksVisible(): Promise<void> {
    const names = [/customer\s*feedback/i, /conversational\s*intelligence/i, /reputation\s*management/i, /digital\s*listening/i, /customer\s*experience\s*leaders/i, /contact\s*center\s*leaders/i, /marketing\s*leaders/i, /insights?\s*leaders?/i, /retail/i, /financial\s*services/i, /healthcare/i, /transportation/i];
    for (const n of names) {
      await expect(this.subLink(n)).toBeVisible();
    }
  }

  /**
   * Follows a named solutions link and verifies URL begins with its href.
   * @param {string} name Link accessible name.
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

  /**
   * Escapes a string for safe regex construction.
   * @param {string} v Input string.
   * @returns {string}
   */
  private escape(v: string): string {
    return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
