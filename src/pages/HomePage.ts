import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page; readonly solutions: Locator; readonly platform: Locator; readonly resources: Locator; readonly partners: Locator; readonly requestDemo: Locator; readonly login: Locator;
  /** Creates a HomePage bound to the given Playwright page. */
  constructor(page: Page) {
    this.page = page;
    this.solutions = page.getByRole('link', { name: /solutions/i });
    this.platform = page.getByRole('link', { name: /platform/i });
    this.resources = page.getByRole('link', { name: /resources/i });
    this.partners = page.getByRole('link', { name: /partners/i });
    this.requestDemo = page.getByRole('link', { name: /request\s*demo/i });
    this.login = page.getByRole('link', { name: /login/i });
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
  async clickTopNav(menu: 'Solutions'|'Platform'|'Resources'|'Partners'): Promise<void> {
    const t = menu==='Solutions'?this.solutions:menu==='Platform'?this.platform:menu==='Resources'?this.resources:this.partners;
    const href = await t.getAttribute('href'); const expected = this.toAbsoluteHref(href);
    await Promise.all([this.page.waitForURL(u=>u.toString().startsWith(expected)), t.click()]);
  }
  /** Follows a named link and asserts URL begins with its href. */
  async followAndAssertLink(name: string): Promise<void> {
    const link = this.linkByName(new RegExp(`^${this.escapeRegExp(name)}$`, 'i'));
    const href = await link.getAttribute('href'); const expected = this.toAbsoluteHref(href);
    await Promise.all([this.page.waitForURL(u=>u.toString().startsWith(expected)), link.click()]);
  }
  /** Clicks Request Demo and waits for navigation. */
  async clickRequestDemo(): Promise<void> {
    const href = await this.requestDemo.getAttribute('href'); const expected = this.toAbsoluteHref(href);
    await Promise.all([this.page.waitForURL(u=>u.toString().startsWith(expected)), this.requestDemo.click()]);
  }
  /** Clicks Login and waits for navigation. */
  async clickLogin(): Promise<void> {
    const href = await this.login.getAttribute('href'); const expected = this.toAbsoluteHref(href);
    await Promise.all([this.page.waitForURL(u=>u.toString().startsWith(expected)), this.login.click()]);
  }
  /** Resolves relative href to absolute using current page url as base. */
  private toAbsoluteHref(href: string | null): string { const raw = href ?? '/'; try { return new URL(raw, this.page.url()).toString(); } catch { return raw; } }
  /** Escapes a string for RegExp constructor. */
  private escapeRegExp(v: string): string { return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  /** Returns current page title. */
  async getTitle(): Promise<string> { return this.page.title(); }
}
