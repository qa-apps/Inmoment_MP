import { test, expect } from '../src/fixtures/test';

// Footer navigation checks: scroll to footer, verify common blocks and
// follow a few links ensuring URL begins with href.

test.describe('Footer navigation', () => {
  test('Footer blocks exist and selected links navigate', async ({ page, gotoHome }) => {
    await gotoHome();

    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect.soft(footer.first()).toBeVisible({ timeout: 10000 });

    // Common blocks
    const headings = [
      /services/i,
      /applications?/i,
      /plans/i,
      /packages/i,
      /customer\s*service/i,
    ];
    for (const h of headings) {
      await expect.soft(footer.getByRole('heading', { name: h }).first()).toBeVisible({ timeout: 10000 });
    }

    // Sample links to follow (best-effort; content may vary)
    const samples = [
      /privacy|policy/i,
      /terms|legal/i,
      /contact/i,
    ];

    for (const n of samples) {
      const link = footer.getByRole('link', { name: n });
      if (await link.count()) {
        const href = await link.first().getAttribute('href');
        if (!href) continue;
        const expected = new URL(href, page.url()).toString();
        await Promise.all([
          page.waitForURL(u => u.toString().startsWith(expected)),
          link.first().click()
        ]);
        // Return to home to keep test stateless
        await page.goto('/');
        await footer.scrollIntoViewIfNeeded();
      }
    }
  });
});
