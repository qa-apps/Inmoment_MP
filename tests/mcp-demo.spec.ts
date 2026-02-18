import { test, expect } from '@playwright/test';

test('MCP demo', async ({ page }, testInfo) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);

  await page.getByRole('link', { name: 'More information...' }).click();
  await expect(page).toHaveURL(/iana\.org/);
  await page.screenshot({ path: testInfo.outputPath('mcp-demo.png') });
});
