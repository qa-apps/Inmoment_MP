import { test, expect } from '../src/fixtures/test';

test.describe('Counter', () => {
  test('increments and decrements using data-testid selectors', async ({ page, counterPage, bootstrapCounter }) => {
    await bootstrapCounter();

    await expect(page.getByRole('heading', { name: 'Counter' })).toBeVisible();
    await expect(page.getByTestId('count')).toHaveText('0');

    await counterPage.increment();
    await expect(page.getByTestId('count')).toHaveText('1');

    await counterPage.decrement();
    await expect(page.getByTestId('count')).toHaveText('0');
  });
});
