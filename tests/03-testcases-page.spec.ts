import { test, expect } from '../framework/fixtures';
import fs from 'fs';
import { csvFile } from '../utils/files';
import { randomUUID } from 'crypto';
import { IMGStory } from '../utils/files';



test.describe('Testcases page', () => { 
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

        test('User can see the reordered list persisted after drag and drop @P2', async ({ page, library }) => {
        const testcaseRow = await page.locator('[data-testid^="testcase-row-title-"]').first().textContent();
        const testcaseRow2 = await page.locator('[data-testid^="testcase-row-title-"]').nth(1).textContent();
        const testcaseHandleCoords = await library.getMiddleOfElement(await page.locator('[data-rfd-drag-handle-draggable-id]').first());
        const testcaseHandle2Coords = await library.getMiddleOfElement(await page.locator('[data-rfd-drag-handle-draggable-id]').nth(1));        
        

            await page.mouse.move(testcaseHandleCoords.x, testcaseHandleCoords.y);
            await page.mouse.down();
            await page.waitForTimeout(1000);
            await page.mouse.move(testcaseHandle2Coords.x, testcaseHandle2Coords.y, { steps: 10 });
            await page.waitForTimeout(1000);
            await page.mouse.up();
            await page.waitForTimeout(5000); // Wait for the reordering to be processed

        const testcaseRowAfterUpdate = await page.locator('[data-testid^="testcase-row-title-"]').first().textContent();
        const testcaseRowAfterUpdate2 = await page.locator('[data-testid^="testcase-row-title-"]').nth(1).textContent();
            

            await expect(testcaseRow2).toBe(testcaseRowAfterUpdate);
            await expect(testcaseRow).toBe(testcaseRowAfterUpdate2);
        });

});


test.describe('Parallel', () => {

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


        test('Creating a testcase with LLM @P1', async ({ page, library }) => {
        let testcaseName = '';
    
            try {
            await page.getByRole('button', { name: 'Create Test Case' }).click();
            await page.getByTestId('create-testcase-prompt-input').fill('Testcase for a basic "log in and create a project" test. Generate a unique id and add it to the title of the testcase at the start. It has to be random and alphanumeric. Take liberties to create a more complex test with edge cases and negative testing. Make sure to include steps, expected results and test data.');
            await page.getByRole('button', { name: 'Generate with AI' }).click();
            await page.waitForResponse(response => response.url().includes('/InvokeLLM') && response.status() === 200);
            await expect(page.getByTestId('editable-testcase-title-input')).not.toBeEmpty();
            testcaseName = await page.getByTestId('editable-testcase-title-input').inputValue();
            await page.getByRole('button', { name: 'Save Test Case' }).click();
            await expect(page.getByText('Test Case Saved')).toBeVisible();
            await page.getByTestId('alert-dialog-ok-btn').click();
            await library.findOpenTestcase(testcaseName);
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can edit the title of the generated test case before saving @P1', async ({ page, library }) => {
        let testcaseName = `playwright-${randomUUID()}`;
    
            try {
            await page.getByRole('button', { name: 'Create Test Case' }).click();
            await page.getByTestId('create-testcase-prompt-input').fill('Testcase for a basic "log in and create a project" test. Generate a unique id and add it to the title of the testcase at the start. It has to be random and alphanumeric. Take liberties to create a more complex test with edge cases and negative testing. Make sure to include steps, expected results and test data.');
            await page.getByRole('button', { name: 'Generate with AI' }).click();
            await page.waitForResponse(response => response.url().includes('/InvokeLLM') && response.status() === 200);
            await expect(page.getByTestId('editable-testcase-title-input')).not.toBeEmpty();
            await page.getByTestId('editable-testcase-title-input').fill(testcaseName);
            await page.getByRole('button', { name: 'Save Test Case' }).click();
            await expect(page.getByText('Test Case Saved')).toBeVisible();
            await page.getByTestId('alert-dialog-ok-btn').click();
            await library.findTestcase(testcaseName);            
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('Creating a testcase manually @POM @P2', async ({ page, library}) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findOpenTestcase(testcaseName);
            await expect(page.getByTestId('editable-testcase-title-input')).toHaveValue(testcaseName);
            }
            
            finally {
            await library.deleteTestcase(testcaseName);
            }});


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


        test('User can switch from Test Cases tab to Stories tab', async ({ page }) => {

            await expect(page.getByTestId('toggle-archived-btn')).toBeVisible();
            await page.getByTestId('testcases-tab-stories').click();
            await expect(page.getByTestId('stories-toggle-archived-btn')).toBeVisible();
            await page.getByTestId('testcases-tab-testcases').click();
            await expect(page.getByTestId('toggle-archived-btn')).toBeVisible();
            });


        test('User can Bulk Delete to delete selected test cases with delete button', async ({ page, library }) => {
            const testcaseName1 = `playwright-${randomUUID()}`;
            const testcaseName2 = `playwright-${randomUUID()}`;
            const testcaseName3 = `playwright-${randomUUID()}`;
            await library.createTestcase(testcaseName1);
            await library.createTestcase(testcaseName2);
            await library.createTestcase(testcaseName3);

            try {
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName1 }).getByRole('checkbox').click();
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName2 }).getByRole('checkbox').click();
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName3 }).getByRole('checkbox').click();
            await page.getByTestId('bulk-delete-btn').click();
            await page.getByTestId('confirm-dialog-confirm-btn').click();
            await expect(page.getByText('Success')).toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName1 })).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName2 })).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName3 })).not.toBeVisible();
            }     

            finally {
            await library.deleteTestcase(testcaseName1, false); // calling deleteTestcase with assertion = false to avoid throwing an error if the testcase is already deleted via new logic i created
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
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName1 }).locator('[data-testid^="testcase-row-checkbox"]').filter( { has: page.locator('[value="on"]') } ).click();
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName2 }).locator('[data-testid^="testcase-row-checkbox"]').filter( { has: page.locator('[value="on"]') } ).click();
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName3 }).locator('[data-testid^="testcase-row-checkbox"]').filter( { has: page.locator('[value="on"]') } ).click();
            await page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 }).click({ button: 'right' });
            await page.getByText('Delete All').click();
            await page.getByTestId('confirm-dialog-confirm-btn').click();
            await expect(page.getByTestId('confirm-dialog-confirm-btn')).not.toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName1 })).not.toBeVisible();
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
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName1 }).locator('[data-testid^="testcase-row-checkbox"]').filter( { has: page.locator('[value="on"]') } ).click();
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName2 }).locator('[data-testid^="testcase-row-checkbox"]').filter( { has: page.locator('[value="on"]') } ).click();
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
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName1 }).locator('[data-testid^="testcase-row-checkbox"]').filter( { has: page.locator('[value="on"]') } ).click();
            await page.locator('[data-testid^=testcase-row]').filter({ hasText: testcaseName2 }).locator('[data-testid^="testcase-row-checkbox"]').filter( { has: page.locator('[value="on"]') } ).click();
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
            

        test('User can delete a test case from the edit modal', async ({ page, library })  => {
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


        test('User can see the test case removed from the list after deletion', async ({ page, library })  => {
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


        test('User can click a test case row to open the edit modal', async ({ page, library })  => {
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


        test('User can click Break Up to split the test case into children', async ({ page, library })  => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        const testcaseName3 = `playwright-${randomUUID()}`;
        const prompt = 'Break this testcase into two separate testcases. Make sure one testcase has the name "' + testcaseName2 + '" and the other has the name "' + testcaseName3 + '"and make sure that the two child testcases have different names"';

        await library.createTestcase(testcaseName);

            try {
            await library.findTestcase(testcaseName);
            await library.rightClickTestcase(testcaseName, "BREAK UP", true, prompt)
            await library.findTestcase(testcaseName);
            await page.locator('[data-testid^="testcase-row-collapse-button"]').click();


            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName2 })).toBeVisible();
            await expect(page.locator('[data-testid^=testcase-row-title]').filter({ hasText: testcaseName3 })).toBeVisible();

            }

            finally{
            await library.deleteTestcase(testcaseName);
            }

            });


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


        test('User can break up a testcase with custom breakup instructions in the break up modal', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        const testcaseName2 = `playwright-${randomUUID()}`;
        const testcaseName3 = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findTestcase(testcaseName);
            await library.rightClickTestcase(testcaseName, "BREAK UP", true, "Make sure to break this testcase into two separate testcases. Make sure one testcase has the name" + testcaseName2 + " and the other has the name" + testcaseName3 + "and make sure that the two child testcases have different names");
            const brokenUpTestcase = await library.findTestcase(testcaseName);
            await brokenUpTestcase!.locator('[data-testid^="testcase-row-collapse-button"]').click();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName2 })).toBeVisible();
            await expect(page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName3 })).toBeVisible();
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }
            });


        test('User can attach image files in the create modal @P3', async ({ page })  => {
            await page.getByTestId('testcases-create-btn').click();
            await page.getByTestId('create-testcase-file-input').setInputFiles(IMGStory);
            await expect(page.getByText('ImgStory.png')).toBeVisible();
            });

        test('User can generate testcase using image @Smoke', async ({ page, library })  => {
        const prompt = 'generate a testcase based on the attached story image';

        await page.getByTestId('testcases-create-btn').click();
        await page.getByTestId('create-testcase-file-input').setInputFiles(IMGStory);
        await expect(page.getByText('ImgStory.png')).toBeVisible();
        await page.getByTestId('create-testcase-prompt-input').fill(prompt);
        await page.getByTestId('create-testcase-generate-btn').click();
        await expect(page.getByText('GENERATED')).toBeVisible({timeout: 60000});
        await expect(page.getByText('Test case created successfully')).toBeVisible();
        await expect(page.getByTestId('editable-testcase-jira-key-input')).toHaveValue('KAN-2');
        await expect(page.getByTestId('editable-testcase-title-input')).toHaveValue(/SSO/);
        const testcaseName = await page.getByTestId('editable-testcase-title-input').inputValue();        
        try {
        await page.getByTestId('create-testcase-save-btn').click();
        }
        finally {
        await library.deleteTestcase(testcaseName);
        }
    
            });
   
        
        test('Validate character limit for custom breakup instructions (max 500 characters) @P2', async ({ page, library })  => {            
        const testcaseName = `playwright-${randomUUID()}`;        
        const prompt = randomUUID();
        await library.createTestcase(testcaseName);

        try {
        await library.findOpenTestcase(testcaseName);
        await page.getByTestId('edit-testcase-break-up-btn').click();
        while (!(await page.getByTestId('breakup-testcase-modal').getByText('500 / 500').isVisible())) {
        await page.getByTestId('breakup-testcase-instructions-input').pressSequentially(prompt);
        }
        await expect(page.getByTestId('breakup-testcase-modal').getByText('500 / 500')).toBeVisible();
        await page.getByTestId('breakup-testcase-instructions-input').pressSequentially(prompt);
        const characterCount = await page.getByTestId('breakup-testcase-instructions-input').inputValue();
        expect(characterCount.length).toBeLessThanOrEqual(500);
        }

        finally {
        await library.deleteTestcase(testcaseName);
        }

            });


        test('User will get a quality score when analyzing a testcase @P2', async ({ page, library })  => {            
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
        }

            });


        test('User will get a "can reach" assessment when analyzing a testcase @P2', async ({ page, library })  => {            
        const testcaseName = `playwright-${randomUUID()}`;        
        await library.createTestcase(testcaseName);

        try {
        await library.rightClickTestcase(testcaseName, "ANALYZE");
        await expect(page.getByText(/Can reach/)).toBeVisible({ timeout: 60000 });
        const canReachScore = await page.getByText(/Can reach/).textContent();
        await expect(canReachScore).toMatch(/\d/);
        const score = parseFloat(canReachScore!.replace(/[^0-9.]/g, ''));   /// also "^" is "not" in regex. make into a number by deleting everything that is not 0 through 9 and dot, /g so globally across the whole string
        expect(score).toBeTruthy();
        expect(score).not.toBeNaN();
        expect(score).toBeLessThanOrEqual(10);
        expect(score).toBeGreaterThanOrEqual(0.1);
    }

        finally {
        await library.deleteTestcase(testcaseName);
        }

            });


        test('User can delete testcase steps from the edit testcase modal @P2', async ({ page, library })  => {            
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

            
});
});