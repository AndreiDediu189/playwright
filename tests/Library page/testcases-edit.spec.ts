import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Testcases - Edit', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

        test('Updating the status of a testcase @POM @P2', async ({ library }) => {
            const testcaseName = `playwright-${randomUUID()}`;
            await library.createTestcase(testcaseName);

            try {
            await library.changeTestcaseStatus(testcaseName, 'READY');
            await library.changeTestcaseStatus(testcaseName, 'IN PROGRESS');
            await library.changeTestcaseStatus(testcaseName, 'COMPLETED');
            await library.changeTestcaseStatus(testcaseName, 'DRAFT');
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can click a test case row to open the edit modal', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName })).toBeVisible();
            await page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName }).click();
            await expect(page.getByText('Edit Test Case')).toBeVisible();
            }

            finally{
            await library.deleteTestcase(testcaseName);
            }
            });


        test('User can delete a test case from the edit modal', async ({ page, library }) => {
        const testcaseName1 = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName1);

            try {
            await library.findOpenTestcase(testcaseName1);
            await page.getByTestId('edit-testcase-delete-btn').click();
            await page.getByTestId('confirm-dialog-confirm-btn').click();
            await expect(page.getByTestId('confirm-dialog-confirm-btn')).not.toBeVisible();
            await library.findTestcase(testcaseName1, false);
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 })).not.toBeVisible();
            }

            finally{
            await library.deleteTestcase(testcaseName1, false);
            }
            });


        test('User can see the test case removed from the list after deletion', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName })).toBeVisible();
            await page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName }).click({ button: 'right' });
            await page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();
            await page.getByTestId('confirm-dialog-confirm-btn').click();
            await expect(page.getByTestId('confirm-dialog-confirm-btn')).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName })).not.toBeVisible();
            }

            finally{
            await library.deleteTestcase(testcaseName, false);
            }
            });


        test('User can unarchive a testcase @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            const testCase = await library.findTestcase(testcaseName);
            await testCase?.click({button:'right'});
            await page.getByRole('menuitem', {name: 'Archive'}).click();
            await expect(page.locator('[data-testid^="testcase-row-title"]').filter({hasText: testcaseName})).not.toBeVisible();
            await page.getByTestId('toggle-archived-btn').click();
            await expect(page.locator('[data-testid^="testcase-row-title"]').filter({hasText: testcaseName})).toBeVisible();
            await page.locator('[data-testid^="testcase-row-title"]').filter({hasText: testcaseName}).click({button:'right'});
            await page.getByRole('menuitem', {name: 'Unarchive'}).click();
            await expect(page.locator('[data-testid^="testcase-row-title"]').filter({hasText: testcaseName})).not.toBeVisible();
            await page.getByTestId('toggle-archived-btn').click();
            await expect(page.locator('[data-testid^="testcase-row-title"]').filter({hasText: testcaseName})).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }
            });


        test('User can delete testcase steps from the edit testcase modal @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findOpenTestcase(testcaseName);
            const numberOfSteps = await page.locator('[data-testid^=editable-testcase-step-action-input]').count();
            await page.getByTestId('editable-testcase-step-remove-btn-1').click();
            const numberOfStepsAfter = await page.locator('[data-testid^=editable-testcase-step-action-input]').count();
            expect(numberOfStepsAfter).toBe(numberOfSteps - 1);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }
            });


        test('Edit modal Add Step button adds new step @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findOpenTestcase(testcaseName);
            const numberOfSteps = await page.locator('[data-testid^=editable-testcase-step-action-input]').count();
            await page.getByTestId('editable-testcase-add-step-btn').click();
            const numberOfStepsAfter = await page.locator('[data-testid^=editable-testcase-step-action-input]').count();
            expect(numberOfStepsAfter).toBe(numberOfSteps + 1);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }
            });


        test('Edit modal step action textarea has max 1000 chars @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const prompt = randomUUID();
        await library.createTestcase(testcaseName);

            try {
            await library.findOpenTestcase(testcaseName);
            const step1Action = page.locator('[data-rfd-draggable-id="step-0"]').locator('.p-3').filter({hasText:'Action'});
            await page.getByTestId('editable-testcase-step-action-input-1').fill('');

            while (!(await step1Action.getByText('0 chars left', { exact: true }).isVisible()))
            {
            await page.getByTestId('editable-testcase-step-action-input-1').pressSequentially(prompt);
            }

            await page.getByTestId('editable-testcase-step-action-input-1').pressSequentially(prompt);
            const characterCount = await page.getByTestId('editable-testcase-step-action-input-1').inputValue();
            expect(characterCount.length).toBe(1000);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }
            });


        test('Steps auto-renumber after removal in edit modal @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findOpenTestcase(testcaseName);
            const step3 = await page.getByTestId('editable-testcase-step-action-input-3').inputValue();
            await page.getByTestId('editable-testcase-step-remove-btn-2').click();
            const step2 = await page.getByTestId('editable-testcase-step-action-input-2').inputValue();
            expect(step3).toBe(step2);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }
            });


        test('User can select multiple test cases and bulk change status', async ({ page, library }) => {
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
            await library.rightClickTestcase(testcaseName, "BULK CHANGE STATUS", true, {status:'READY'} );
            await library.findTestcase(testcaseName);
            await expect(page.locator('[data-testid^="testcase-row-"]').filter({ hasText: testcaseName }).locator('[data-testid^="testcase-row-status"]:not([data-testid^="testcase-row-status-wrapper"])')).toContainText('READY');
            await library.findTestcase(testcaseName2);
            await expect(page.locator('[data-testid^="testcase-row-"]').filter({ hasText: testcaseName2 }).locator('[data-testid^="testcase-row-status"]:not([data-testid^="testcase-row-status-wrapper"])')).toContainText('READY');
            await library.findTestcase(testcaseName3);
            await expect(page.locator('[data-testid^="testcase-row-"]').filter({ hasText: testcaseName3 }).locator('[data-testid^="testcase-row-status"]:not([data-testid^="testcase-row-status-wrapper"])')).toContainText('READY');
            }
            
            finally {
            await library.deleteTestcase(testcaseName);
            await library.deleteTestcase(testcaseName2);
            await library.deleteTestcase(testcaseName3);
            }});



        test('Updated test case reflects immediately in list', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);


            try {
            const testCase = await library.findTestcaseOnPage(testcaseName);
            testCase?.click();
            await page.getByTestId('editable-testcase-title-input').fill(testcaseName2);
            await page.getByTestId('edit-testcase-save-btn').click();
            await page.getByTestId('alert-dialog-ok-btn').click();
            await library.findTestcaseOnPage(testcaseName2);

            }
            
            finally {
            await library.deleteTestcase(testcaseName2);

            }});


        test('Testcase priority can be changed', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);


            try {
            const testCase = await library.findTestcaseOnPage(testcaseName);
            const testCasePrio = testCase?.locator('[data-testid^="testcase-row-priority"]:not([data-testid^="testcase-row-priority-wrapper"])');
            testCasePrio?.click();
            await page.getByRole('option', {name:"LOW"}).click();
            await expect(testCasePrio!).toContainText("LOW");
            testCasePrio?.click();
            await page.getByRole('option', {name:"MEDIUM"}).click();
            await expect(testCasePrio!).toContainText("MEDIUM");
            testCasePrio?.click();
            await page.getByRole('option', {name:"HIGH"}).click();
            await expect(testCasePrio!).toContainText("HIGH");
            }
            
            finally {
            await library.deleteTestcase(testcaseName);

            }});
}); 