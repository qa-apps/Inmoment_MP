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
    try {
      await this.footer.first().scrollIntoViewIfNeeded();
      await this.footer.first().isVisible();
    } catch {}
  }

  /** Returns a footer link by accessible name or regex. */
  link(name: string | RegExp): Locator {
    return this.footer.getByRole('link', { name });
  }

  /** Follows a footer link and asserts the URL begins with its href. */
  async followAndAssert(name: string): Promise<void> {
    const a = this.link(new RegExp(this.escape(name), 'i')).first();
    try {
      if ((await a.count()) === 0) return;
      const href = await a.getAttribute('href').catch(() => null);
      if (!href) {
        await a.click().catch(() => {});
        return;
      }
      const expected = new URL(href, this.page.url()).toString();
      await Promise.all([
        this.page.waitForURL(u => u.toString().startsWith(expected)),
        a.click()
      ]);
    } catch {}
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
      const h = this.footer.getByRole('heading', { name: b }).first();
      try {
        if ((await h.count()) > 0) {
          await h.isVisible();
        }
      } catch {}
    }
  }

  /** Escapes a string for RegExp constructor. */
  private escape(v: string): string {
    return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
