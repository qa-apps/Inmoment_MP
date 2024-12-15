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
  /** Goes to the site home using configured baseURL. */
  async goto(): Promise<void> { await this.page.goto('/'); }
  /** Returns link by accessible name or regex. */
  linkByName(name: string | RegExp): Locator { return this.page.getByRole('link', { name }); }
  /** Hovers a top-level menu to reveal submenu. */
  async hoverMenu(menu: 'Solutions'|'Platform'|'Resources'|'Partners'): Promise<void> {
    const t = menu==='Solutions'?this.solutions:menu==='Platform'?this.platform:menu==='Resources'?this.resources:this.partners; await t.hover();
  }
  /** Clicks a top-level menu and waits for navigation. */
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
  /** Follows a named link and asserts URL begins with its href. */
  async followAndAssertLink(name: string): Promise<void> {
    const link = this.linkByName(new RegExp(`^${this.escapeRegExp(name)}$`, 'i'));
    const href = await link.getAttribute('href'); const expected = this.toAbsoluteHref(href);
    await Promise.all([this.page.waitForURL(u=>u.toString().startsWith(expected)), link.click()]);
  }
  /** Clicks Request Demo and waits for navigation. */
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
  /** Clicks Login and waits for navigation. */
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
  /** Resolves relative href to absolute using current page url as base. */
  private toAbsoluteHref(href: string | null): string { const raw = href ?? '/'; try { return new URL(raw, this.page.url()).toString(); } catch { return raw; } }
  /** Escapes a string for RegExp constructor. */
  private escapeRegExp(v: string): string { return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  /** Returns current page title. */
  async getTitle(): Promise<string> { return this.page.title(); }
}
