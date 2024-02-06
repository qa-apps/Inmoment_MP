import { test as base, expect } from '@playwright/test';
import { CounterPage } from '../pages/CounterPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { PartnersPage } from '../pages/PartnersPage';
import { PlatformPage } from '../pages/PlatformPage';
import { RequestDemoPage } from '../pages/RequestDemoPage';
import { ResourcesPage } from '../pages/ResourcesPage';
import { SolutionsPage } from '../pages/SolutionsPage';
import { FooterPage } from '../pages/FooterPage';
import { dismissConsent, ensureRegion, zapConsentOverlays } from '../utils/consent';

export type Fixtures = {
  counterPage: CounterPage;
  homePage: HomePage;
  loginPage: LoginPage;
  partnersPage: PartnersPage;
  platformPage: PlatformPage;
  requestDemoPage: RequestDemoPage;
  resourcesPage: ResourcesPage;
  solutionsPage: SolutionsPage;
  footerPage: FooterPage;
  bootstrapCounter: () => Promise<void>;
  gotoHome: () => Promise<void>;
  overlayGuard?: void;
};

export const test = base.extend<Fixtures>({
  overlayGuard: [async ({ page }, use) => {
    const handler = async () => { await dismissConsent(page); await zapConsentOverlays(page); };
    page.on('framenavigated', handler);
    page.on('load', handler);
    await handler();
    await use();
    page.off('framenavigated', handler);
    page.off('load', handler);
  }, { auto: true }],
  counterPage: async ({ page }, use) => {
    const cp = new CounterPage(page);
    await use(cp);
  },
  homePage: async ({ page }, use) => {
    const hp = new HomePage(page);
    await use(hp);
  },
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await use(lp);
  },
  partnersPage: async ({ page }, use) => {
    const pp = new PartnersPage(page);
    await use(pp);
  },
  platformPage: async ({ page }, use) => {
    const pp = new PlatformPage(page);
    await use(pp);
  },
  footerPage: async ({ page }, use) => {
    const fp = new FooterPage(page);
    await use(fp);
  },
  requestDemoPage: async ({ page }, use) => {
    const rdp = new RequestDemoPage(page);
    await use(rdp);
  },
  resourcesPage: async ({ page }, use) => {
    const rp = new ResourcesPage(page);
    await use(rp);
  },
  solutionsPage: async ({ page }, use) => {
    const sp = new SolutionsPage(page);
    await use(sp);
  },
  bootstrapCounter: async ({ page }, use) => {
    const html = `
      <main>
        <h1>Counter</h1>
        <div data-testid="count">0</div>
        <button type="button" data-testid="inc">Increment</button>
        <button type="button" data-testid="dec">Decrement</button>
        <script>
          (function(){
            const countEl = document.querySelector('[data-testid="count"]');
            const inc = document.querySelector('[data-testid="inc"]');
            const dec = document.querySelector('[data-testid="dec"]');
            let value = 0;
            const render = () => { countEl.textContent = String(value); };
            inc.addEventListener('click', () => { value += 1; render(); });
            dec.addEventListener('click', () => { value -= 1; render(); });
            render();
          })();
        </script>
      </main>
    `;
    await use(async () => {
      await page.setContent(html);
    });
  },
  gotoHome: async ({ page }, use) => {
    await use(async () => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await dismissConsent(page);
      await ensureRegion(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.soft(page.locator('header').first()).toBeVisible({ timeout: 15000 });
    });
  }
});

export { expect };
