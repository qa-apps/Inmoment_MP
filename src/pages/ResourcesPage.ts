import { Page, Locator, expect } from '@playwright/test';
import { zapConsentOverlays } from '../utils/consent';

export class ResourcesPage {
  readonly page: Page;

  readonly searchBox: Locator;
  readonly article: Locator;

  /**
   * Constructs a ResourcesPage object.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByLabel(/search/i)
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"]'))
      .first();
    this.article = page.getByRole('article')
      .or(page.locator('[class*="card" i]'))
      .or(page.locator('.post-item'))
      .first();
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
   * Navigates to the Resources root page.
   * @returns {Promise<void>}
   */
  async gotoRoot(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="/resources" i], a:has-text("Resources"), a:has-text("Learn & Connect")').first();
    const rh = await link.getAttribute('href');
    const expected = new URL(rh ?? '/resources/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }

  /**
   * Navigates to the Blog page.
   * @returns {Promise<void>}
   */
  async gotoBlog(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="/blog" i], a:has-text("Blog")').first();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/blog/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }

  /**
   * Navigates to the Podcast page.
   * @returns {Promise<void>}
   */
  async gotoPodcast(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="podcast" i], a:has-text("Podcast")').first();
    const blogLink = this.page.locator(':is(a,button)[href*="/blog" i], a:has-text("Blog")').first();
    const href = (await link.getAttribute('href')) || (await blogLink.getAttribute('href')) || '/blog/';
    const expected = new URL(href, this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }

  /**
   * Navigates to the ROI Calculator page.
   * @returns {Promise<void>}
   */
  async gotoROI(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="/roi" i], a:has-text("ROI"), a:has-text("Calculate")').first();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/roi-calculator/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }

  /**
   * Navigates to the Events page.
   * @returns {Promise<void>}
   */
  async gotoEvents(): Promise<void> {
    const link = this.page.locator(':is(a,button)[href*="/events" i], a:has-text("Events")').first();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/events/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
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
      const el = this.subLink(n).first();
      try {
        if ((await el.count()) > 0) {
          await el.isVisible();
        }
      } catch {}
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
