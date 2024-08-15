import { test, expect } from '../src/fixtures/test';

// Footer navigation checks: scroll to footer, verify common blocks and
// follow a few links ensuring URL begins with href.

test.describe('Footer navigation', () => {
  test('Footer blocks exist and selected links navigate', async ({ page, gotoHome, footerPage }) => {
    await gotoHome();

    await footerPage.scrollToFooter();
    await footerPage.assertCommonBlocks();

    // Sample links to follow (best-effort; content may vary)
    const samples = ['Privacy', 'Terms', 'Contact'];
    for (const name of samples) {
      await footerPage.followAndAssert(name);
      // Return to home to keep test stateless
      await page.goto('/');
      await footerPage.scrollToFooter();
    }
  });
});
