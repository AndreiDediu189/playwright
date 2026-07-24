import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Testcases - Breakup', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

        test('User can open the break up modal from the row context menu @P3', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            const testCase = await library.findTestcase(testcaseName);
            await testCase?.click({button:'right'});
            await page.getByRole('menuitem', {name:'Break Up'}).click();
            await expect(page.getByTestId('breakup-testcase-modal')).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can click BREAKUP to split the test case into children', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        const testcaseName3 = `playwright-${randomUUID()}`;
        const prompt = 'Break this testcase into two separate testcases. Make sure one testcase has the name "' + testcaseName2 + '" and the other has the name "' + testcaseName3 + '"and make sure that the two child testcases have different names"';
        await library.createTestcase(testcaseName);

            try {
            await library.findTestcase(testcaseName);
            await library.rightClickTestcase(testcaseName, "BREAKUP", true, prompt);
            await library.findTestcase(testcaseName);
            await page.locator('[data-testid^="testcase-row-collapse-button"]').click();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName2 })).toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName3 })).toBeVisible();
            }

            finally{
            await library.deleteTestcase(testcaseName);
            }});


        test('User can BREAKUP a testcase with custom breakup instructions in the BREAKUP modal', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        const testcaseName3 = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findTestcase(testcaseName);
            await library.rightClickTestcase(testcaseName, "BREAKUP", true, "Make sure to break this testcase into two separate testcases. Make sure one testcase has the name" + testcaseName2 + " and the other has the name" + testcaseName3 + "and make sure that the two child testcases have different names");
            const brokenUpTestcase = await library.findTestcase(testcaseName);
            await brokenUpTestcase!.locator('[data-testid^="testcase-row-collapse-button"]').click();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName2 })).toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName3 })).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can see the parent is no longer marked as broken up after reverting @P2', async ({ library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            const testcaseRow = await library.findTestcase(testcaseName);
            await library.rightClickTestcase(testcaseName,"BREAKUP");
            await expect(testcaseRow!.getByText('BROKEN UP', {exact:false})).toBeVisible();
            await library.rightClickTestcase(testcaseName,"REVERT BREAKUP");
            await expect(testcaseRow!.getByText('BROKEN UP', {exact:false})).not.toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('Validate character limit for custom breakup instructions (max 500 characters) @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const prompt = randomUUID();
        await library.createTestcase(testcaseName);

            try {
            await library.findOpenTestcase(testcaseName);
            await page.getByTestId('edit-testcase-break-up-btn').click();
            while (!(await page.getByTestId('breakup-testcase-modal').getByText('0 chars left').isVisible())) {
            await page.getByTestId('breakup-testcase-instructions-input').pressSequentially(prompt);
            }
            await expect(page.getByTestId('breakup-testcase-modal').getByText('0 chars left')).toBeVisible();
            await page.getByTestId('breakup-testcase-instructions-input').pressSequentially(prompt);
            const characterCount = await page.getByTestId('breakup-testcase-instructions-input').inputValue();
            expect(characterCount.length).toBeLessThanOrEqual(500);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});

});
