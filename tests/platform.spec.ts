import { test, expect } from '../src/fixtures/test';

// Platform navigation smoke tests for key areas.

test.describe('Platform navigation', () => {
  test('Platform top-level and core areas', async ({ page, gotoHome, platformPage }) => {
    await gotoHome();
    await platformPage.openFromHome();

    // Rely on POM to assert key areas are present
    await platformPage.assertKeyAreasVisible();
  });

  test('Platform page has discoverable content blocks', async ({ page, gotoHome, platformPage }) => {
    await gotoHome();
    await platformPage.openFromHome();

    // Use POM-level soft assertions for common areas instead of raw heading selectors
    await platformPage.assertKeyAreasVisible();
  });
});
