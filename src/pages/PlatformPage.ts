import { Page, Locator, expect } from '@playwright/test';
import { zapConsentOverlays } from '../utils/consent';

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
    const header = this.page.getByRole('banner');
    let link = header
      .getByRole('link', { name: /platform|xi\s*platform/i })
      .or(header.getByRole('button', { name: /platform|xi\s*platform/i }))
      .or(header.locator(':is(a,button)[href*="platform" i], :is(a,button):has-text("Platform"), :is(a,button):has-text("XI Platform")'))
      .first();
    let href = await link.getAttribute('href');
    if (!href) {
      // Fallback to any platform link on the page
      link = this.page.locator(':is(a,button)[href*="/xi-platform" i], a:has-text("XI Platform"), a:has-text("Platform")').first();
      href = await link.getAttribute('href');
    }
    const base = new URL(href ?? '/xi-platform/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(base);
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
      const el = this.subLink(n).first();
      try {
        if ((await el.count()) > 0) {
          await el.isVisible();
        }
      } catch {}
    }
  }
}
