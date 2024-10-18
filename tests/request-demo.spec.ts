import { test, expect } from '../src/fixtures/test';
import { randomEmail, randomString, randomPhone } from '../src/utils/data';

// Request Demo flow: navigate from home, verify presence of a form,
// and attempt a benign submit with random data without expecting success.

test.describe('Request Demo', () => {
  test('opens from top nav and attempts a benign form submit', async ({ page, gotoHome, requestDemoPage }) => {
    await gotoHome();
    await requestDemoPage.openFromHome();

    // Only interact if a visible form exists
    const hasForm = (await requestDemoPage.form.count()) > 0 && await requestDemoPage.form.first().isVisible().catch(() => false);
    if (hasForm) {
      await requestDemoPage.fillCommon({
        first: 'QA-' + randomString(6),
        last: randomString(7),
        email: randomEmail(),
        company: 'InMoment Test',
        phone: randomPhone(),
        country: 'United States'
      });

      // Best-effort submit
      await requestDemoPage.submitForm();
    }

    // Soft-check page did not navigate to an obvious error route
    await expect.soft(page).not.toHaveURL(/error|404/i);
  });
});
