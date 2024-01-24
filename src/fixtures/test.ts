import { test as base, expect } from '@playwright/test';
import { CounterPage } from '../pages/CounterPage';
import { HomePage } from '../pages/HomePage';

export type Fixtures = {
  counterPage: CounterPage;
  homePage: HomePage;
  bootstrapCounter: () => Promise<void>;
  gotoHome: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  counterPage: async ({ page }, use) => {
    const cp = new CounterPage(page);
    await use(cp);
  },
  homePage: async ({ page }, use) => {
    const hp = new HomePage(page);
    await use(hp);
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
      await page.goto('/');
    });
  }
});

export { expect };
