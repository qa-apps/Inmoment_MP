import { Page, Locator, expect } from '@playwright/test';
import { zapConsentOverlays } from '../utils/consent';

export class RequestDemoPage {
  readonly page: Page;
  readonly form: Locator;
  readonly submit: Locator;

  /**
   * Constructs a RequestDemoPage.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('form');
    this.submit = page.getByRole('button', { name: /submit|request|demo|send/i });
  }

  /**
   * Opens Request Demo from the top navigation link on the home page.
   * @returns {Promise<void>}
   */
  async openFromHome(): Promise<void> {
    const link = this.page.locator('a.header-cta-button:has-text("Request a Demo"), :is(a,button)[href*="/demo" i], :is(a,button):has-text("Request a Demo")').first();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/demo/', this.page.url()).toString();
    await zapConsentOverlays(this.page);
    await this.page.goto(expected);
  }

  /**
   * Returns a text input by accessible label or placeholder.
   * @param {RegExp} label Label/placeholder matcher.
   * @returns {Locator}
   */
  input(label: RegExp): Locator {
    return this.page.getByLabel(label)
      .or(this.page.getByPlaceholder(label))
      .or(this.page.locator('input').filter({ has: this.page.getByLabel(label) }))
      .first();
  }

  /**
   * Fills common contact fields if present.
   * @param {object} data Arbitrary form data.
   * @returns {Promise<void>}
   */
  async fillCommon(data: { first?: string; last?: string; email?: string; company?: string; phone?: string; country?: string; }): Promise<void> {
    const { first, last, email, company, phone, country } = data;
    const set = async (re: RegExp, val?: string) => {
      if (!val) return;
      const el = this.input(re);
      if (await el.count() && await el.isVisible().catch(() => false)) {
        await el.fill(val).catch(() => {});
      }
    };
    await set(/first\s*name/i, first);
    await set(/last\s*name/i, last);
    await set(/email/i, email);
    await set(/company/i, company);
    await set(/phone/i, phone);
    
    if (country) {
      const combo = this.page.getByRole('combobox').or(this.page.getByLabel(/country/i));
      if (await combo.count()) {
        const c = combo.first();
        if (await c.isVisible().catch(() => false)) {
          await c.click().catch(() => {});
          const opt = this.page.getByRole('option', { name: new RegExp(country, 'i') }).first();
          if (await opt.count()) await opt.click().catch(() => {});
        }
      }
    }
  }

  /**
   * Attempts to submit the form. Does not assert success as public demo forms vary by site.
   * @returns {Promise<void>}
   */
  async submitForm(): Promise<void> {
    if (await this.submit.count() && await this.submit.first().isVisible().catch(() => false)) {
      await this.submit.first().click().catch(() => {});
    } else if (await this.form.count()) {
      // Try finding submit within form if general submit not found/visible
      const formSubmit = this.form.locator('button[type="submit"], input[type="submit"]').first();
      if (await formSubmit.count() && await formSubmit.isVisible()) {
        await formSubmit.click().catch(() => {});
      }
    }
  }
}
