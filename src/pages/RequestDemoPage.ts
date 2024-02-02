import { Page, Locator, expect } from '@playwright/test';

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
    const link = this.page.getByRole('link', { name: /request\s*(a\s*)?demo/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    const expected = new URL(href ?? '/', this.page.url()).toString();
    await Promise.all([
      this.page.waitForURL(u => u.toString().startsWith(expected)),
      link.click()
    ]);
  }

  /**
   * Returns a text input by accessible label or placeholder.
   * @param {RegExp} label Label/placeholder matcher.
   * @returns {Locator}
   */
  input(label: RegExp): Locator {
    return this.page.getByLabel(label).or(this.page.getByPlaceholder(label)).or(this.page.locator('input').filter({ has: this.page.getByLabel(label) }));
  }

  /**
   * Fills common contact fields if present.
   * @param {object} data Arbitrary form data.
   * @returns {Promise<void>}
   */
  async fillCommon(data: { first?: string; last?: string; email?: string; company?: string; phone?: string; country?: string; }): Promise<void> {
    const { first, last, email, company, phone, country } = data;
    const set = async (re: RegExp, val?: string) => { if (!val) return; const el = this.input(re); if (await el.count()) await el.first().fill(val); };
    await set(/first\s*name/i, first);
    await set(/last\s*name/i, last);
    await set(/email/i, email);
    await set(/company/i, company);
    await set(/phone/i, phone);
    if (country) {
      const combo = this.page.getByRole('combobox').or(this.page.getByLabel(/country/i));
      if (await combo.count()) {
        await combo.first().click();
        await this.page.getByRole('option', { name: new RegExp(country, 'i') }).first().click({ trial: true }).catch(() => {});
        await this.page.getByRole('option', { name: new RegExp(country, 'i') }).first().click().catch(() => {});
      }
    }
  }

  /**
   * Attempts to submit the form. Does not assert success as public demo forms vary by site.
   * @returns {Promise<void>}
   */
  async submitForm(): Promise<void> {
    if (await this.submit.count()) {
      await this.submit.first().click();
    } else if (await this.form.count()) {
      await this.form.press('Enter');
    }
  }
}
