import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  /**
   * Constructs a new LoginPage.
   * @param {Page} page Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i)
      .or(page.getByPlaceholder(/email/i))
      .or(page.locator('input[type="email"], input[id*="email" i], input[name*="email" i]'))
      .first();
    this.nextButton = page.getByRole('button', { name: /next|continue/i });
    this.passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i));
    this.signInButton = page.getByRole('button', { name: /sign in|log in/i });
  }

  /**
   * Navigates to the login page by clicking the header login link from home.
   * @returns {Promise<void>} Resolves when navigation completes.
   */
  async gotoFromHome(): Promise<void> {
    await this.page.getByRole('link', { name: /login/i }).click();
    await expect(this.emailInput).toBeVisible();
  }

  /**
   * Types an email into the email field.
   * @param {string} email Email address to enter.
   * @returns {Promise<void>}
   */
  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Clicks the Next/Continue button after entering the email.
   * @returns {Promise<void>}
   */
  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  /**
   * Types a password into the password field.
   * @param {string} password Password value.
   * @returns {Promise<void>}
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Returns whether the Sign in button is enabled.
   * @returns {Promise<boolean>} True if enabled, false otherwise.
   */
  async isSignInEnabled(): Promise<boolean> {
    return await this.signInButton.isEnabled();
  }

  /**
   * Attempts to enter an email if the email input is visible.
   * @param {string} email Email to enter.
   * @returns {Promise<boolean>} True if filled, false otherwise.
   */
  async tryEnterEmail(email: string): Promise<boolean> {
    try {
      if (await this.emailInput.isVisible()) {
        await this.emailInput.fill(email);
        return true;
      }
    } catch {}
    return false;
  }

  /**
   * Attempts to click the Next or Continue button if present and visible.
   * @returns {Promise<boolean>} True if clicked, false otherwise.
   */
  async tryClickNext(): Promise<boolean> {
    try {
      if ((await this.nextButton.count()) && await this.nextButton.first().isVisible()) {
        await this.nextButton.first().click();
        return true;
      }
    } catch {}
    return false;
  }

  /**
   * Attempts to enter a password if the password input is visible.
   * @param {string} password Password to enter.
   * @returns {Promise<boolean>} True if filled, false otherwise.
   */
  async tryEnterPassword(password: string): Promise<boolean> {
    try {
      if (await this.passwordInput.isVisible()) {
        await this.passwordInput.fill(password);
        return true;
      }
    } catch {}
    return false;
  }

  /**
   * Attempts to click the Sign In button if present and visible.
   * @returns {Promise<boolean>} True if clicked, false otherwise.
   */
  async tryClickSignIn(): Promise<boolean> {
    try {
      if ((await this.signInButton.count()) && await this.signInButton.first().isVisible()) {
        await this.signInButton.first().click();
        return true;
      }
    } catch {}
    return false;
  }
}
