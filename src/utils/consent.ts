import { Page } from '@playwright/test';

export async function dismissConsent(page: Page): Promise<void> {
  const selectors = [
    'button#onetrust-accept-btn-handler',
    'button[aria-label*="accept" i]',
    'button:has-text("Accept All")',
    'button:has-text("Accept")',
    'button:has-text("Agree")',
    'button:has-text("Got it")',
    'button:has-text("I agree")',
    'button:has-text("Allow all")',
    'button:has-text("OK")',
    '[role="button"]:has-text("Accept")',
    'a:has-text("Accept")'
  ];
  for (const s of selectors) {
    const el = page.locator(s).first();
    try {
      if (await el.isVisible({ timeout: 500 }).catch(() => false)) {
        await el.click({ timeout: 1000 }).catch(() => {});
        break;
      }
    } catch {}
  }
  await zapConsentOverlays(page);
}

export async function ensureRegion(page: Page): Promise<void> {
  const region = page
    .getByRole('link', { name: /united\s*states\/?canada\s*\(english\)/i })
    .or(page.getByRole('button', { name: /united\s*states|canada/i }))
    .or(page.locator('a[href="https://inmoment.com"]'));
  try {
    if (await region.first().isVisible({ timeout: 500 }).catch(() => false)) {
      await region.first().click({ timeout: 1000 }).catch(() => {});
    }
  } catch {}
}

export async function zapConsentOverlays(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      const ids = ['onetrust-consent-sdk', 'ot-sdk-cookie-policy'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.parentElement) el.parentElement.removeChild(el);
      });
      const selectors = [
        '.onetrust-pc-dark-filter',
        '.ot-floating-button',
        '.ot-sdk-container',
        '.ot-sdk-row',
        '.ot-sdk-four',
      ];
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach((n) => {
          const el = n as HTMLElement;
          el.style.pointerEvents = 'none';
          el.style.display = 'none';
          el.remove?.();
        });
      }
    });
  } catch {}
}
