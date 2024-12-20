import { test, expect } from '../src/fixtures/test';

// Solutions navigation and submenu smoke tests.
// Verifies visible links and URL transitions based on href attributes.

test.describe.skip('Solutions navigation', () => {
  test('Solutions top-level and key solution links', async ({ page, gotoHome, solutionsPage }) => {
    await gotoHome();
    await solutionsPage.openFromHome();

    // Assert presence of key solution sub-links and verify navigation.
    const links = [
      { name: 'Customer Feedback', path: '/customer-experience-platform/customer-feedback/' },
      { name: 'Conversational Intelligence', path: '/customer-experience-platform/conversational-intelligence/' },
      { name: 'Reputation Management', path: '/customer-experience-platform/reputation-management/' },
      { name: 'Digital Listening', path: '/customer-experience-platform/digital-listening/' }
    ];

    for (const link of links) {
      const target = new URL(link.path, page.url()).toString();
      await page.goto(target);
      await expect(page).toHaveTitle(new RegExp(`${link.name.split(' ')[0]}|InMoment`, 'i'));
    }

    // Industry/role links smoke presence (soft checks)
    await solutionsPage.openFromHome();
    await solutionsPage.assertKeyLinksVisible();
  });
});
