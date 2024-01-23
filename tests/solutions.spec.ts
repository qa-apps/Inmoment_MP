import { test, expect } from '../src/fixtures/test';

// Solutions navigation and submenu smoke tests.
// Verifies visible links and URL transitions based on href attributes.

test.describe('Solutions navigation', () => {
  test('Solutions top-level and key solution links', async ({ page, gotoHome }) => {
    await gotoHome();

    // Open Solutions
    const solutions = page.getByRole('link', { name: /^solutions$/i });
    await expect(solutions).toBeVisible();
    const href = await solutions.getAttribute('href');
    expect(href).toBeTruthy();
    const expected = new URL(href!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(expected)),
      solutions.click()
    ]);

    // Assert presence of key solution sub-links and verify navigation.
    const links = [
      'Customer Feedback',
      'Conversational Intelligence',
      'Reputation Management',
      'Digital Listening',
    ];

    for (const name of links) {
      const link = page.getByRole('link', { name: new RegExp(`^${name}$`, 'i') });
      await expect(link).toBeVisible();
      const subHref = await link.getAttribute('href');
      expect(subHref, `${name} should have href`).toBeTruthy();
      const subExpected = new URL(subHref!, page.url()).toString();
      await Promise.all([
        page.waitForURL(u => u.toString().startsWith(subExpected)),
        link.click()
      ]);
      // Return to Solutions landing for next iteration
      await page.goto(expected);
    }

    // Industry/role links smoke presence
    const visible = [
      /customer\s*experience\s*leaders/i,
      /contact\s*center\s*leaders/i,
      /marketing\s*leaders/i,
      /insights?\s*leaders?/i,
      /retail/i,
      /financial\s*services/i,
      /healthcare/i,
      /transportation/i,
    ];
    for (const n of visible) {
      await expect(page.getByRole('link', { name: n })).toBeVisible();
    }
  });
});
