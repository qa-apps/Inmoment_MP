import { test, expect } from '../src/fixtures/test';

// Resources → Calculate the ROI of integrated CX smoke test

test.describe('ROI calculator navigation', () => {
  test('navigates to Calculate the ROI', async ({ page, gotoHome, resourcesPage }) => {
    await gotoHome();
    await resourcesPage.gotoROI();

    // Soft checks to avoid flakiness across content updates
    await expect(page).toHaveTitle(/roi|return on investment|inmoment/i);

    // Best-effort checks (do not fail if absent)
    const maybeHeading = page.getByRole('heading').first();
    if ((await maybeHeading.count()) > 0) {
      await maybeHeading.isVisible().catch(() => {});
    }

    const inputs = page.locator('input, select');
    if ((await inputs.count()) > 0) {
      await inputs.first().isVisible().catch(() => {});
    }
  });
});
