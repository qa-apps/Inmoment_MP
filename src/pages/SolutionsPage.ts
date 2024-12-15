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
   * Navigates to Solutions via the top nav link and waits for URL change.
   * @returns {Promise<void>}
   */
  async openFromHome(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="/customer-experience-platform" i], :is(a,button)[href*="/solutions" i], a:has-text("Solutions")').first();
    const href = await link.getAttribute('href');
    const base = new URL(href ?? '/customer-experience-platform/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(base);
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
      await expect.soft(this.subLink(n).first()).toBeVisible({ timeout: 10000 });
    }
  }
}
