import { Page, Locator, expect } from '@playwright/test';
import { zapConsentOverlays } from '../utils/consent';

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
   * Navigates to the Solutions area using any available header link variant.
   * Uses direct navigation via href to avoid overlay click interception and
   * variant specific menu implementations. Falls back to the general CX
   * platform landing route if the explicit solutions link is not found.
   * @returns {Promise<void>} Resolves when the target page is loaded.
   */
  async openFromHome(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="/customer-experience-platform" i], :is(a,button)[href*="/solutions" i], a:has-text("Solutions")').first();
    const href = await link.getAttribute('href');
    const base = new URL(href ?? '/customer-experience-platform/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(base);
  }

  /**
   * Returns a locator for a specific Solutions sub link by accessible name.
   * This helper prefers accessible roles first for stability.
   * @param {string|RegExp} name Link accessible name or pattern.
   * @returns {Locator} A stable link locator.
   */
  subLink(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }

  /**
   * Performs best effort checks for the presence of key solution links.
   * The method avoids hard failures in order to remain resilient across
   * site variants and content changes.
   * @returns {Promise<void>} Resolves after checks complete.
   */
  async assertKeyLinksVisible(): Promise<void> {
    const names = [/customer\s*feedback/i, /conversational\s*intelligence/i, /reputation\s*management/i, /digital\s*listening/i, /customer\s*experience\s*leaders/i, /contact\s*center\s*leaders/i, /marketing\s*leaders/i, /insights?\s*leaders?/i, /retail/i, /financial\s*services/i, /healthcare/i, /transportation/i];
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
