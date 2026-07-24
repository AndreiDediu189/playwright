import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { csvFile } from '../../utils/files';

test.describe('Testcases - Stories', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

        test('User can click a test case within a story to open the edit modal @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseStory = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName, testcaseStory);

            try {
            await page.getByTestId('testcases-tab-stories').click();
            await expect(page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory })).toBeVisible();
            await page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory }).click();
            await page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click();
            await expect(page.getByText('Edit Test Case')).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can right-click a story to open the story context menu @P3', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseStory = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName, testcaseStory);

            try {
            await page.getByTestId('testcases-tab-stories').click();
            await expect(page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory })).toBeVisible();
            await page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory }).click({ button: 'right' });
            await expect(page.getByRole('menu').filter({ hasText: testcaseStory })).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can archieve then view archived story test cases @P3', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseStory = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName, testcaseStory);

            try {
            await library.findTestcase(testcaseName);
            await page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click({ button: 'right' });
            await page.getByRole('menuitem').filter({ hasText: 'Archive' }).click();
            await library.findTestcase(testcaseName, false);
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName })).not.toBeVisible();
            await page.getByTestId('testcases-tab-stories').click();
            await page.getByTestId('stories-toggle-archived-btn').click();
            await expect(page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory })).toBeVisible();
            await page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory }).click();
            await page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click({ button: 'right' });
            await page.getByRole('menuitem').filter({ hasText: 'Unarchive' }).click();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can export a story to CSV from the story context menu @P3', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseStory = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName, testcaseStory);

            try {
            await page.getByTestId('testcases-tab-stories').click();
            await page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory }).click({ button: 'right' });
            const promise = page.waitForEvent('download');
            await page.getByText('Export to CSV').click();
            const file = await promise;
            const path = await file.path();
            const CSVcontent = fs.readFileSync(path, 'utf-8');
            const CSVTemplate = fs.readFileSync(csvFile, 'utf-8');
            const expectedContent = CSVTemplate.replace('{{testcaseName}}', testcaseName).replace('{{testcaseStory}}', testcaseStory);
            expect(CSVcontent).toEqual(expectedContent);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can highglight and delete all testcases linked to a story @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        const testcaseName3 = `playwright-${randomUUID()}`;
        const testcaseStory = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName, testcaseStory);
        await library.createTestcase(testcaseName2, testcaseStory);
        await library.createTestcase(testcaseName3, testcaseStory);

            try {
            await page.getByTestId('testcases-tab-stories').click();
            await expect(page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory })).toBeVisible();
            await page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory }).click();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName2 })).toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName3 })).toBeVisible();
            await page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory }).getByRole('checkbox').click();
            await page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click({ button: 'right' });
            await page.getByRole('menuitem').filter({ hasText: 'Delete All' }).click();
            await page.getByTestId('confirm-dialog-confirm-btn').click();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseStory })).not.toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).not.toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName2 })).not.toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName3 })).not.toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName, false);
            await library.deleteTestcase(testcaseName2, false);
            await library.deleteTestcase(testcaseName3, false);
            }});


        test('Creating new testcases on the same story groups them all under that story @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        const testcaseName3 = `playwright-${randomUUID()}`;
        const testcaseStory = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName, testcaseStory);
        await library.createTestcase(testcaseName2, testcaseStory);
        await library.createTestcase(testcaseName3, testcaseStory);

            try {
            await page.getByTestId('testcases-tab-stories').click();
            await expect(page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory })).toBeVisible();
            await page.locator('[data-testid^="story-card"]').filter({ hasText: testcaseStory }).click();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName2 })).toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName3 })).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            await library.deleteTestcase(testcaseName2);
            await library.deleteTestcase(testcaseName3);
            }});

});
