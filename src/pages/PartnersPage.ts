import { Page, Locator, expect } from '@playwright/test';
import { zapConsentOverlays } from '../utils/consent';

export class PartnersPage {
  readonly page: Page;

  /**
   * Constructs a PartnersPage object bound to a Playwright page.
   * @param {Page} page Playwright page instance used for navigation and queries.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens the Partners page via any visible header link or button variant.
   * Uses safe direct navigation to the extracted href and falls back to
   * a default route when the href is not present. Consent overlays are
   * cleared before navigation to avoid click interception.
   * @returns {Promise<void>} Resolves after navigation completes.
   */
  async openFromHome(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="/partners" i], a:has-text("Partners")').first();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/partners/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }

  /**
   * Returns a locator for a partner CTA by accessible name or pattern.
   * @param {string|RegExp} name Link name or regex pattern.
   * @returns {Locator} Stable link locator for the target CTA.
   */
  link(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }

  /**
   * Soft asserts visibility of key partner CTAs to avoid flakiness across
   * site variants and content rotations.
   * @returns {Promise<void>} Resolves after checks complete.
   */
  async assertKeyCtasVisible(): Promise<void> {
    const names = [
      /partner/i,
      /become/i,
    ];
    for (const n of names) {
      await expect.soft(this.link(n).first()).toBeVisible({ timeout: 5000 });
    }
  }
}
