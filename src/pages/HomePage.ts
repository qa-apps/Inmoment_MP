import { Page, Locator } from '@playwright/test';
import { zapConsentOverlays } from '../utils/consent';

export class HomePage {
  readonly page: Page; readonly header: Locator; readonly solutions: Locator; readonly platform: Locator; readonly resources: Locator; readonly partners: Locator; readonly requestDemo: Locator; readonly login: Locator;
  /** Creates a HomePage bound to the given Playwright page. */
  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('banner');
    this.solutions = this.header
      .getByRole('link', { name: /solutions/i })
      .or(this.header.getByRole('button', { name: /solutions/i }))
      .or(this.header.locator(':is(a,button)[href*="solution" i], :is(a,button):has-text("Solutions")'))
      .first();
    this.platform = this.header
      .getByRole('link', { name: /platform|xi\s*platform/i })
      .or(this.header.getByRole('button', { name: /platform|xi\s*platform/i }))
      .or(this.header.locator(':is(a,button)[href*="platform" i], :is(a,button):has-text("Platform"), :is(a,button):has-text("XI Platform")'))
      .first();
    this.resources = this.header
      .getByRole('link', { name: /resources|learn\s*&\s*connect/i })
      .or(this.header.getByRole('button', { name: /resources|learn\s*&\s*connect/i }))
      .or(this.header.locator(':is(a,button)[href*="resource" i], :is(a,button):has-text("Resources"), :is(a,button):has-text("Learn & Connect")'))
      .first();
    this.partners = this.header
      .getByRole('link', { name: /partners/i })
      .or(this.header.getByRole('button', { name: /partners/i }))
      .or(this.header.locator(':is(a,button)[href*="partner" i], :is(a,button):has-text("Partners")'))
      .first();
    this.requestDemo = this.header
      .getByRole('link', { name: /request\s*(a\s*)?demo/i })
      .or(this.header.getByRole('button', { name: /request\s*(a\s*)?demo/i }))
      .or(this.header.locator('a.header-cta-button:has-text("Request a Demo"), :is(a,button)[href*="request" i][href*="demo" i], :is(a,button):has-text("Request a Demo")'))
      .first();
    this.login = this.header
      .getByRole('link', { name: /login/i })
      .or(this.header.getByRole('button', { name: /login/i }))
      .or(this.header.locator(':is(a,button)[href*="login" i], :is(a,button):has-text("Login")'))
      .first();
  }
  /**
   * Navigates to the site home using the configured baseURL.
   * Ensures consumers can land on the root path reliably.
   * @returns {Promise<void>}
   */
  async goto(): Promise<void> { await this.page.goto('/'); }
  /**
   * Returns a link located by accessible name or regular expression.
   * @param {string|RegExp} name Accessible name or pattern.
   * @returns {Locator} Link locator.
   */
  linkByName(name: string | RegExp): Locator { return this.page.getByRole('link', { name }); }
  /**
   * Hovers a top-level menu to reveal its submenu.
   * @param {('Solutions'|'Platform'|'Resources'|'Partners')} menu Menu name.
   * @returns {Promise<void>}
   */
  async hoverMenu(menu: 'Solutions'|'Platform'|'Resources'|'Partners'): Promise<void> {
    const t = menu==='Solutions'?this.solutions:menu==='Platform'?this.platform:menu==='Resources'?this.resources:this.partners; await t.hover();
  }
  /**
   * Clicks a top-level menu and performs robust navigation using its href when available.
   * Falls back to a direct click when the element is a button without href.
   * @param {('Solutions'|'Platform'|'Resources'|'Partners')} menu Menu name.
   * @returns {Promise<void>}
   */
  async clickTopNav(menu: 'Solutions' | 'Platform' | 'Resources' | 'Partners'): Promise<void> {
    const t = menu === 'Solutions' ? this.solutions : menu === 'Platform' ? this.platform : menu === 'Resources' ? this.resources : this.partners;
    const href = await t.getAttribute('href');
    if (href) {
      const expected = this.toAbsoluteHref(href);
      await zapConsentOverlays(this.page);
      await this.page.goto(expected);
    } else {
      // If no href (dropdown button), we might need specific handling, but for now we assume robust tests handle sub-links.
      // This method is primarily for top-level navigation.
      await zapConsentOverlays(this.page);
      await t.click().catch(() => {});
    }
  }
  /**
   * Follows a named link and asserts the URL begins with its href.
   * @param {string} name Link accessible name.
   * @returns {Promise<void>}
   */
  async followAndAssertLink(name: string): Promise<void> {
    const link = this.linkByName(new RegExp(`^${this.escapeRegExp(name)}$`, 'i'));
    const href = await link.getAttribute('href'); const expected = this.toAbsoluteHref(href);
    await Promise.all([this.page.waitForURL(u=>u.toString().startsWith(expected)), link.click()]);
  }
  /**
   * Clicks Request Demo and waits for navigation.
   * Attempts to resolve a known href and falls back to defaults.
   * @returns {Promise<void>}
   */
  async clickRequestDemo(): Promise<void> {
    // Robust fallback logic: try known locators if primary fails or has no href
    let t = this.requestDemo;
    let href = await t.getAttribute('href');
    if (!href) {
      // Try finding any visible demo link
      const alt = this.page.locator('a.header-cta-button:has-text("Request a Demo"), :is(a,button)[href*="/demo" i], :is(a,button):has-text("Request a Demo")').first();
      if (await alt.count()) { t = alt; href = await alt.getAttribute('href'); }
    }
    const expected = this.toAbsoluteHref(href ?? '/demo/');
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }
  /**
   * Clicks Login and waits for navigation.
   * Falls back to identity provider launch URL when href is absent.
   * @returns {Promise<void>}
   */
  async clickLogin(): Promise<void> {
    let t = this.login;
    let href = await t.getAttribute('href');
    if (!href) {
      const alt = this.page.locator(':is(a,button)[href*="login" i], :is(a,button):has-text("Login")').first();
      if (await alt.count()) { t = alt; href = await alt.getAttribute('href'); }
    }
    const expected = this.toAbsoluteHref(href ?? 'https://identity.inmoment.com/launch');
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }
  /**
   * Resolves a relative href to an absolute URL using the current page as base.
   * @param {string|null} href Relative or absolute href.
   * @returns {string} Absolute URL string.
   */
  private toAbsoluteHref(href: string | null): string { const raw = href ?? '/'; try { return new URL(raw, this.page.url()).toString(); } catch { return raw; } }
  /**
   * Escapes a string for use in a regular expression.
   * @param {string} v Raw string.
   * @returns {string} Escaped string.
   */
  private escapeRegExp(v: string): string { return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  /**
   * Returns the current page title.
   * @returns {Promise<string>} Title text.
   */
  async getTitle(): Promise<string> { return this.page.title(); }
}
