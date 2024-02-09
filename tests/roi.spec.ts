import { test, expect } from '../src/fixtures/test';

// Resources → Calculate the ROI of integrated CX smoke test

test.describe('ROI calculator navigation', () => {
  test('navigates from Resources to Calculate the ROI', async ({ page, gotoHome }) => {
    await gotoHome();

    // Open Resources
    const resources = page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    const rh = await resources.getAttribute('href');
    expect(rh).toBeTruthy();
    const rExpected = new URL(rh!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(rExpected)),
      resources.click()
    ]);

    // Navigate to ROI
    const roi = page.getByRole('link', { name: /calculate\s*the\s*roi/i });
    await expect(roi).toBeVisible();
    const roiHref = await roi.getAttribute('href');
    expect(roiHref).toBeTruthy();
    const roiExpected = new URL(roiHref!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(roiExpected)),
      roi.click()
    ]);

    // Soft checks to avoid flakiness across content updates
    await expect(page).toHaveTitle(/roi|return on investment|inmoment/i);

    const headings = [
      /roi/i,
      /calculator/i,
      /cx/i,
    ];
    for (const h of headings) {
      await expect.soft(page.getByRole('heading', { name: h })).toBeVisible({ timeout: 10000 });
    }

    // If a form/input exists, ensure it is interactive (best-effort)
    const inputs = page.locator('input, select');
    await expect.soft(inputs.first()).toBeVisible({ timeout: 10000 });
  });
});
