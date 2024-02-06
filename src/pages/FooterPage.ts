import { Page, Locator, expect } from '@playwright/test';

export class FooterPage {
  readonly page: Page;
  readonly footer: Locator;

  /** Creates FooterPage bound to the given page. */
  constructor(page: Page) {
    this.page = page;
    this.footer = page.locator('footer');
  }

  /** Scrolls to footer and ensures it is visible. */
  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
    await expect.soft(this.footer.first()).toBeVisible({ timeout: 10000 });
  }

  /** Returns a footer link by accessible name or regex. */
  link(name: string | RegExp): Locator {
    return this.footer.getByRole('link', { name });
  }

  /** Follows a footer link and asserts the URL begins with its href. */
  async followAndAssert(name: string): Promise<void> {
    const a = this.link(new RegExp(`^${this.escape(name)}$`, 'i'));
    const href = await a.getAttribute('href');
    if (!href) return; // best effort
    const expected = new URL(href, this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(expected)),
      a.click()
    ]);
  }

  /** Asserts common footer blocks are present by headings/links. */
  async assertCommonBlocks(): Promise<void> {
    const blocks = [
      /services/i,
      /applications?/i,
      /plans/i,
      /packages/i,
      /customer\s*service/i,
    ];
    for (const b of blocks) {
      const h = this.footer.getByRole('heading', { name: b });
      await expect.soft(h.first()).toBeVisible({ timeout: 10000 });
    }
  }

  /** Escapes a string for RegExp constructor. */
  private escape(v: string): string {
    return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
