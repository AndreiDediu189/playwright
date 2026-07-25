import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Testcases - Analysis', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

        test('User will get a quality score when analyzing a testcase @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.rightClickTestcase(testcaseName, "ANALYZE");
            await expect(page.getByText('Quality Score')).toBeVisible({ timeout: 60000 });
            const qscore = await page.getByTestId('analysis-modal').locator('.text-3xl').textContent();
            expect(Number(qscore)).toBeTruthy();
            expect(Number(qscore)).not.toBeNaN();
            expect(Number(qscore)).toBeLessThanOrEqual(10);
            expect(Number(qscore)).toBeGreaterThanOrEqual(0.1);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User will get a "can reach" assessment when analyzing a testcase @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.rightClickTestcase(testcaseName, "ANALYZE");
            await expect(page.getByText(/Can reach/)).toBeVisible({ timeout: 60000 });
            const canReachScore = await page.getByText(/Can reach/).textContent();
            await expect(canReachScore).toMatch(/\d/);
            const score = parseFloat(canReachScore!.replace(/[^0-9.]/g, ''));
            expect(score).toBeTruthy();
            expect(score).not.toBeNaN();
            expect(score).toBeLessThanOrEqual(10);
            expect(score).toBeGreaterThanOrEqual(0.1);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can see issues listed in the analysis result @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findTestcase(testcaseName);
            await library.rightClickTestcase(testcaseName,"ANALYZE");
            await expect(page.locator('.p-3').filter({hasText:"Issues Found"})).toBeVisible({timeout:60000});
            const feedbackAmount = await page.locator('.p-3').filter({hasText:"Issues Found"}).locator('> *').count();
            const feedbackContent = page.locator('.p-3').filter({hasText:"Issues Found"}).locator('> *');
            expect(feedbackAmount).toBeGreaterThan(3);
            for (let i = 0; i < feedbackAmount; i++) {
            await expect(feedbackContent.nth(i)).not.toBeEmpty();
            }}

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can select multiple test cases and trigger bulk analysis', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        const testcaseName3 = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);
        await library.createTestcase(testcaseName2);
        await library.createTestcase(testcaseName3);

            try {
            await (await library.findTestcaseOnPage(testcaseName))!.locator('[data-testid^=testcase-row-checkbox][type=button]').click();
            await (await library.findTestcaseOnPage(testcaseName2))!.locator('[data-testid^=testcase-row-checkbox][type=button]').click();
            await (await library.findTestcaseOnPage(testcaseName3))!.locator('[data-testid^=testcase-row-checkbox][type=button]').click();
            await library.rightClickTestcase(testcaseName, "ANALYZE");
            await expect(page.getByTestId('bulk-analysis-modal')).toBeVisible();
            await expect(page.getByText('Bulk Test Case AnalysisAnalyzing 3 test cases')).toBeVisible();
            await expect(page.getByRole('button', { name:"Implement All (3)" })).toBeVisible({timeout:120000});
            await expect(page.locator(".p-4").filter({hasText:"Analyzed"})).toBeVisible();
            await expect(page.locator(".p-4").filter({hasText:"Avg Score"})).toBeVisible();
            await expect(page.locator(".p-4").filter({hasText:"Issues"})).toBeVisible();
            const analysisResultNumber = await page.locator('[data-testid^=analysis-result]').count();
            expect(analysisResultNumber).toBe(3);
            for ( let i = 0; i < analysisResultNumber; i++ ) {
            await expect(page.locator('[data-testid^=analysis-result]').nth(i)).toContainText(/\d+ issues/);
            await expect(page.locator('[data-testid^=analysis-result]').nth(i)).toContainText(/\d+ suggestions/);
            }
            }

            finally {
            await library.deleteTestcase(testcaseName);
            await library.deleteTestcase(testcaseName2);
            await library.deleteTestcase(testcaseName3);
            }});

        
});
