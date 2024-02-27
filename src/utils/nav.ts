import { Page, Locator, expect } from '@playwright/test';

/** Resolves relative href to absolute URL using current page URL as base. */
export function toAbsolute(page: Page, href: string | null): string {
  const raw = href ?? '/';
  try { return new URL(raw, page.url()).toString(); } catch { return raw; }
}

/** Clicks a role+name element and waits for URL to start with its href. */
export async function clickRoleAndWaitHref(page: Page, role: 'link'|'button', name: string|RegExp): Promise<void> {
  const el = page.getByRole(role, { name });
  const href = role === 'link' ? await el.getAttribute('href') : null;
  const expected = toAbsolute(page, href);
  await Promise.all([
    page.waitForURL(u => u.toString().startsWith(expected)),
    el.first().click()
  ]);
}

/** Opens a top-level menu link by its exact visible name and verifies title. */
export async function openTopMenu(page: Page, name: string, titleMatcher: RegExp): Promise<void> {
  const link = page.getByRole('link', { name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
  const href = await link.getAttribute('href');
  expect(href, `${name} should have href`).toBeTruthy();
  await clickRoleAndWaitHref(page, 'link', new RegExp(`^${escapeRegex(name)}$`, 'i'));
  await expect(page).toHaveTitle(titleMatcher);
}

/** Follows a named link within the current page and returns to a given URL. */
export async function followLinkAndReturn(page: Page, name: string, returnUrl: string): Promise<void> {
  const link = page.getByRole('link', { name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
  const href = await link.getAttribute('href');
  const expected = toAbsolute(page, href);
  await Promise.all([
    page.waitForURL(u => u.toString().startsWith(expected)),
    link.click()
  ]);
  await page.goto(returnUrl);
}

/** Soft-assert that a set of headings are visible. */
export async function softAssertHeadings(page: Page, names: Array<string|RegExp>): Promise<void> {
  for (const n of names) {
    await expect.soft(page.getByRole('heading', { name: typeof n === 'string' ? new RegExp(n, 'i') : n })).toBeVisible({ timeout: 10000 });
  }
}

/** Escapes a string for safe use in regex constructor. */
export function escapeRegex(v: string): string {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
