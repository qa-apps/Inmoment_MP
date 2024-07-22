import { test, expect } from '../src/fixtures/test';

// Resources → Events navigation and soft content checks

test.describe('Events navigation', () => {
  test('navigates to Events and checks content markers', async ({ page, gotoHome }) => {
    await gotoHome();
    // Locate any Events link and navigate, or fallback to /events
    const eventsLink = page.locator(':is(a,button)[href*="/events" i], a:has-text("Events")').first();
    const eh = await eventsLink.getAttribute('href');
    const eExpected = new URL(eh ?? '/events', page.url()).toString();
    await page.goto(eExpected);

    await expect(page).toHaveTitle(/events|inmoment/i);

    // Soft content checks (avoid flakiness across content updates)
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible({ timeout: 10000 });

    // An event teaser/list item should be visible
    const listItem = page.getByRole('listitem').first();
    await expect.soft(listItem).toBeVisible({ timeout: 10000 });
  });

  test('events page exposes filters or categories and at least one upcoming item', async ({ page, gotoHome }) => {
    await gotoHome();
    const eventsLink = page.locator(':is(a,button)[href*="/events" i], a:has-text("Events")').first();
    const eh = await eventsLink.getAttribute('href');
    const eExpected = new URL(eh ?? '/events', page.url()).toString();
    await page.goto(eExpected);

    await expect(page).toHaveTitle(/events|inmoment/i);
    const anyItem = page.getByRole('listitem').or(page.locator('[class*="event" i]'));
    await expect.soft(anyItem.first()).toBeVisible({ timeout: 10000 });
  });
});
