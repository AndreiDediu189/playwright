import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Testcases - Bulk Actions', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

        test('User can Bulk Delete to delete selected test cases with delete button', async ({ page, library }) => {
        test.setTimeout(60000);
            const testcaseName1 = `playwright-${randomUUID()}`;
            const testcaseName2 = `playwright-${randomUUID()}`;
            const testcaseName3 = `playwright-${randomUUID()}`;
            await library.createTestcase(testcaseName1);
            await library.createTestcase(testcaseName2);
            await library.createTestcase(testcaseName3);

            try {
            await library.selectTestcases({ testcaseName: [testcaseName1, testcaseName2, testcaseName3] });
            await page.getByTestId('bulk-delete-btn').click();
            await page.getByTestId('confirm-dialog-confirm-btn').click();
            await expect(page.getByTestId('confirm-dialog-confirm-btn')).not.toBeVisible();
            await expect(page.locator('.pointer-events-auto')).toContainText('SUCCESS');
            await expect(page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName1 })).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName2 })).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName3 })).not.toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName1, false);
            await library.deleteTestcase(testcaseName2, false);
            await library.deleteTestcase(testcaseName3, false);
            }});


        test('User can Bulk Delete to delete selected test cases with right click delete button', async ({ page, library }) => {
        test.setTimeout(60000);
            const testcaseName1 = `playwright-${randomUUID()}`;
            const testcaseName2 = `playwright-${randomUUID()}`;
            const testcaseName3 = `playwright-${randomUUID()}`;
            await library.createTestcase(testcaseName1);
            await library.createTestcase(testcaseName2);
            await library.createTestcase(testcaseName3);

            try {
            await library.selectTestcases({ testcaseName: [testcaseName1, testcaseName2, testcaseName3] });
            await page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 }).click({ button: 'right' });
            await page.getByText('Delete All').click();
            await page.getByTestId('confirm-dialog-confirm-btn').click();
            await expect(page.getByTestId('confirm-dialog-confirm-btn')).not.toBeVisible();
            await expect(page.locator('.pointer-events-auto')).toContainText('SUCCESS');
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 })).not.toBeVisible({timeout:60000});
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName2 })).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName3 })).not.toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName1, false);
            await library.deleteTestcase(testcaseName2, false);
            await library.deleteTestcase(testcaseName3, false);
            }});


        test('User can cancel Bulk Delete', async ({ page, library }) => {
            const testcaseName1 = `playwright-${randomUUID()}`;
            const testcaseName2 = `playwright-${randomUUID()}`;
            await library.createTestcase(testcaseName1);
            await library.createTestcase(testcaseName2);

            try {
            await library.selectTestcases({ testcaseName: [testcaseName1, testcaseName2] });
            await page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 }).click({ button: 'right' });
            await page.getByText('Delete All').click();
            await page.getByTestId('confirm-dialog-cancel-btn').click();
            await expect(page.getByTestId('confirm-dialog-confirm-btn')).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 })).toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName2 })).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName1, false);
            await library.deleteTestcase(testcaseName2, false);
            }});


        test('User can cancel bulk archive in the confirmation dialog', async ({ page, library }) => {
            const testcaseName1 = `playwright-${randomUUID()}`;
            const testcaseName2 = `playwright-${randomUUID()}`;
            await library.createTestcase(testcaseName1);
            await library.createTestcase(testcaseName2);

            try {
            await library.selectTestcases({ testcaseName: [testcaseName1, testcaseName2] });
            await page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 }).click({ button: 'right' });
            await page.getByText('Archive All').click();
            await page.getByTestId('confirm-dialog-cancel-btn').click();
            await expect(page.getByTestId('confirm-dialog-confirm-btn')).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 })).toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName2 })).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName1);
            await library.deleteTestcase(testcaseName2);
            }});

});
