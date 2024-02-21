import { test, expect } from '../src/fixtures/test';

// Resources → Events navigation and soft content checks

test.describe('Events navigation', () => {
  test('navigates from Resources to Events and checks content markers', async ({ page, gotoHome }) => {
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

    // Click Events
    const events = page.getByRole('link', { name: /^events$/i });
    await expect(events).toBeVisible();
    const eh = await events.getAttribute('href');
    expect(eh).toBeTruthy();
    const eExpected = new URL(eh!, page.url()).toString();
    await Promise.all([
      page.waitForURL(u => u.toString().startsWith(eExpected)),
      events.click()
    ]);

    await expect(page).toHaveTitle(/events|inmoment/i);

    // Soft content checks (avoid flakiness across content updates)
    const headings = page.getByRole('heading');
    await expect.soft(headings.first()).toBeVisible({ timeout: 10000 });

    // If there is a filter or date picker, it should be visible
    const filter = page.getByRole('combobox').or(page.getByLabel(/filter|type|category/i));
    await expect.soft(filter.first()).toBeVisible({ timeout: 10000 });

    // An event teaser/list item should be visible
    const listItem = page.getByRole('listitem').first();
    await expect.soft(listItem).toBeVisible({ timeout: 10000 });
  });

  test('events page exposes filters or categories and at least one upcoming item', async ({ page, gotoHome }) => {
    await gotoHome();
    const resources = page.getByRole('link', { name: /^resources$/i });
    await expect(resources).toBeVisible();
    await resources.click();
    const events = page.getByRole('link', { name: /^events$/i });
    await expect(events).toBeVisible();
    await events.click();

    await expect(page).toHaveTitle(/events|inmoment/i);
    const filter = page.getByRole('combobox').or(page.getByLabel(/filter|type|category/i));
    await expect.soft(filter.first()).toBeVisible({ timeout: 10000 });
    const anyItem = page.getByRole('listitem').or(page.locator('[class*="event" i]'));
    await expect.soft(anyItem.first()).toBeVisible({ timeout: 10000 });
  });
});
