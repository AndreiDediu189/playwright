import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Testcases - Filters', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

test.describe.serial('Non-parallel @manual', () => {

        test('Status filters testcase amount updates dynamically', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        let statusCount = await page.locator('[data-status-key="draft"]').locator('.text-2xl').textContent();
        await library.createTestcase(testcaseName);

            try {
            let statusUpdatedCount = await page.locator('[data-status-key="draft"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBeGreaterThan(Number(statusCount));
            await library.changeTestcaseStatus(testcaseName, 'READY');
            statusUpdatedCount = await page.locator('[data-status-key="draft"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBe(Number(statusCount));

            await library.changeTestcaseStatus(testcaseName, 'DRAFT');
            statusCount = await page.locator('[data-status-key="ready"]').locator('.text-2xl').textContent();
            await library.changeTestcaseStatus(testcaseName, 'READY');
            statusUpdatedCount = await page.locator('[data-status-key="ready"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBeGreaterThan(Number(statusCount));
            await library.changeTestcaseStatus(testcaseName, 'IN PROGRESS');
            statusUpdatedCount = await page.locator('[data-status-key="ready"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBe(Number(statusCount));

            await library.changeTestcaseStatus(testcaseName, 'READY');
            statusCount = await page.locator('[data-status-key="in_progress"]').locator('.text-2xl').textContent();
            await library.changeTestcaseStatus(testcaseName, 'IN PROGRESS');
            statusUpdatedCount = await page.locator('[data-status-key="in_progress"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBeGreaterThan(Number(statusCount));
            await library.changeTestcaseStatus(testcaseName, 'COMPLETED');
            statusUpdatedCount = await page.locator('[data-status-key="in_progress"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBe(Number(statusCount));

            await library.changeTestcaseStatus(testcaseName, 'IN PROGRESS');
            statusCount = await page.locator('[data-status-key="completed"]').locator('.text-2xl').textContent();
            await library.changeTestcaseStatus(testcaseName, 'COMPLETED');
            statusUpdatedCount = await page.locator('[data-status-key="completed"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBeGreaterThan(Number(statusCount));
            await library.changeTestcaseStatus(testcaseName, 'IN PROGRESS');
            statusUpdatedCount = await page.locator('[data-status-key="completed"]').locator('.text-2xl').textContent();
            await expect(Number(statusUpdatedCount)).toBe(Number(statusCount));
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});

            });


        test('Filtering by status buttons @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await page.locator('[data-status-key="draft"]').click();
            await library.findTestcase(testcaseName);

            await library.changeTestcaseStatus(testcaseName, 'READY');
            await page.locator('[data-status-key="ready"]').click();
            await library.findTestcase(testcaseName);

            await library.changeTestcaseStatus(testcaseName, 'IN PROGRESS');
            await page.locator('[data-status-key="in_progress"]').click();
            await library.findTestcase(testcaseName);

            await library.changeTestcaseStatus(testcaseName, 'COMPLETED');
            await page.locator('[data-status-key="completed"]').click();
            await library.findTestcase(testcaseName);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('Filtering by status dropdown @P2', async ({ page, library }) => {
            const testcaseName = `playwright-${randomUUID()}`;
            await library.createTestcase(testcaseName);

            try{
            await page.getByTestId('status-filter-select').click();
            await page.getByRole('option', { name: 'Draft' }).click();
            await library.findTestcase(testcaseName);

            await library.changeTestcaseStatus(testcaseName, 'READY');
            await page.getByTestId('status-filter-select').click();
            await page.getByRole('option', { name: 'Ready' }).click();
            await library.findTestcase(testcaseName);

            await library.changeTestcaseStatus(testcaseName, 'IN PROGRESS');
            await page.getByTestId('status-filter-select').click();
            await page.getByRole('option', { name: 'completed' }).click();
            await library.findTestcase(testcaseName);

            await library.changeTestcaseStatus(testcaseName, 'COMPLETED');
            await page.getByTestId('status-filter-select').click();
            await library.findTestcase(testcaseName);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can click a specific page number in the pagination to jump to that page @P2', async ({ page }) => {
            const testcaseName = await page.locator('[data-testid^="testcase-row-title-"]').first().textContent();
            await page.getByTestId('pagination-page-3').click();
            const testcaseNameOnPage3 = await page.locator('[data-testid^="testcase-row-title-"]').first().textContent();
            await expect(testcaseName).not.toBe(testcaseNameOnPage3);
            });


        test('Clicking a specific page number in the pagination will highlight that page number @P3', async ({ page }) => {
            await page.getByTestId('pagination-page-3').click();
            await expect(page.getByTestId('pagination-page-3')).toHaveAttribute('style', 'color: white; border: 1px solid rgb(99, 102, 241); background: rgb(79, 70, 229);');
            });


        test('User can switch from Test Cases tab to Stories tab', async ({ page }) => {
            await expect(page.getByTestId('toggle-archived-btn')).toBeVisible();
            await page.getByTestId('testcases-tab-stories').click();
            await expect(page.getByTestId('stories-toggle-archived-btn')).toBeVisible();
            await page.getByTestId('testcases-tab-testcases').click();
            await expect(page.getByTestId('toggle-archived-btn')).toBeVisible();
            });

});
