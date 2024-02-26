import { Page, Locator, expect } from '@playwright/test';

export class CounterPage {
  readonly page: Page; readonly count: Locator; readonly inc: Locator; readonly dec: Locator;

  /**
   * Constructs a new CounterPage bound to the provided Playwright page.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.count = page.getByTestId('count');
    this.inc = page.getByTestId('inc');
    this.dec = page.getByTestId('dec');
  }

  /**
   * Clicks the increment control.
   * @returns {Promise<void>} Resolves when the click action completes.
   */
  async increment(): Promise<void> { await this.inc.click(); }

  /**
   * Clicks the decrement control.
   * @returns {Promise<void>} Resolves when the click action completes.
   */
  async decrement(): Promise<void> { await this.dec.click(); }

  /**
   * Reads the current counter value displayed in the UI.
   * @returns {Promise<number>} The current numeric counter value.
   */
  async getCount(): Promise<number> { const text = await this.count.textContent(); return Number(text ?? 0); }

  /**
   * Clicks the increment control multiple times.
   * @param {number} times Number of increments to perform.
   * @returns {Promise<void>}
   */
  async incrementBy(times: number): Promise<void> { for (let i = 0; i < times; i++) await this.increment(); }

  /**
   * Clicks the decrement control multiple times.
   * @param {number} times Number of decrements to perform.
   * @returns {Promise<void>}
   */
  async decrementBy(times: number): Promise<void> { for (let i = 0; i < times; i++) await this.decrement(); }

  /**
   * Adjusts the counter to a specific target value by clicking increment or decrement.
   * @param {number} target Desired counter value.
   * @returns {Promise<void>}
   */
  async setCount(target: number): Promise<void> { const current = await this.getCount(); const diff = target - current; if (diff > 0) await this.incrementBy(diff); if (diff < 0) await this.decrementBy(Math.abs(diff)); }

  /**
   * Waits until the counter displays the expected value.
   * @param {number} expected Target counter value.
   * @returns {Promise<void>}
   */
  async waitForCount(expected: number): Promise<void> { await expect(this.count).toHaveText(String(expected)); }
}
