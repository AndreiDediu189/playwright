import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Pagination', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

         test('Library pagination updates number of displayed testcases correctly when showing 10 testcases per page', async ({ page }) => {

            await page.getByTestId('page-size-select').selectOption('10')
            await expect(page.getByText(/Showing 1 to 10 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-2').click();
            await expect(page.getByText(/Showing 11 to 20 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-3').click();
            await expect(page.getByText(/Showing 21 to 30 of \d+ test cases/)).toBeVisible();
        });


            test('Library pagination updates number of displayed testcases correctly when showing 25 testcases per page', async ({ page }) => {

            await page.getByTestId('page-size-select').selectOption('25')
            await expect(page.getByText(/Showing 1 to 25 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-2').click();
            await expect(page.getByText(/Showing 26 to 50 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-3').click();
            await expect(page.getByText(/Showing 51 to 75 of \d+ test cases/)).toBeVisible();
        });

    
        
        test('Library pagination updates number of displayed testcases correctly when showing 50 testcases per page', async ({ page }) => {

            await page.getByTestId('page-size-select').selectOption('50')
            await expect(page.getByText(/Showing 1 to 50 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-2').click();
            await expect(page.getByText(/Showing 51 to 100 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-3').click();
            await expect(page.getByText(/Showing 101 to 150 of \d+ test cases/)).toBeVisible();
        });




        test('Library pagination updates number of displayed testcases correctly when showing 100 testcases per page', async ({ page }) => {

            await page.getByTestId('page-size-select').selectOption('100')
            await expect(page.getByText(/Showing 1 to 100 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-2').click();
            await expect(page.getByText(/Showing 101 to 200 of \d+ test cases/)).toBeVisible();
            await page.getByTestId('pagination-page-3').click();
            await expect(page.getByText(/Showing 201 to 300 of \d+ test cases/)).toBeVisible();
        });
 });
