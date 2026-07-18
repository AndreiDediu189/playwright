import { test, expect } from '../framework/fixtures';
import { IMGUI } from '../utils/files';
import { IMGStory } from '../utils/files';
import { PDFStory } from '../utils/files';

test.describe('Analyze page', () => {
test.beforeEach(async ({ page }) => {       
    await page.goto('/analyze');
    await page.waitForLoadState('domcontentloaded');
});



        test('Generate with UI Image @POM @smoke @P1', async ({ page, library }) => {
            await page.locator('input[type="file"][accept="image/*"]').setInputFiles(IMGUI);
            await page.locator('[data-testid^="file-description-"]').fill('Generate a unique id and add it to the title of the testcase at the start. It has to be random and alphanumeric.');
            await page.getByRole('button', { name: 'Generate with UI' }).click();
            await expect(page.getByRole('heading', { name: 'SUCCESS' })).toBeVisible({ timeout: 600000 });
            const testcaseName = await page.getByTestId('editable-testcase-title-input').inputValue();
            await expect(testcaseName).toBeTruthy();
            await expect(page.getByRole('button', { name: 'Save Test Case' })).toBeVisible();


            try {
            await page.getByRole('button', { name: 'Save Test Case' }).click();
            await expect(page.getByText('Test Case Saved')).toBeVisible();
            await page.getByTestId('alert-dialog-ok-btn').click();
            await library.findOpenTestcase(testcaseName);
            await expect(page.getByTestId('editable-testcase-title-input')).toHaveValue(testcaseName);
            }
            
            finally {
            await library.deleteTestcase(testcaseName);
            }

            
        });

        
        
        test('Generate with Story Image @POM @smoke @P1', async ({ page, library }) => {
            await page.locator('input[type="file"][accept="image/*,.pdf"]').setInputFiles(IMGStory);
            await page.locator('[data-testid^="file-description-"]').fill('Generate a unique id and add it to the title of the testcase at the start. It has to be random and alphanumeric.');
            await page.getByRole('button', { name: 'Generate with Story' }).click();
            await expect(page.getByRole('heading', { name: 'SUCCESS' })).toBeVisible({ timeout: 600000 });
            const testcaseName = await page.getByTestId('editable-testcase-title-input').inputValue();
            await expect(testcaseName).toBeTruthy();
            await expect(page.getByRole('button', { name: 'Save Test Case' })).toBeVisible();
            await page.getByRole('button', { name: 'Save Test Case' }).click();
            await expect(page.getByText('Test Case Saved')).toBeVisible();
            await page.getByTestId('alert-dialog-ok-btn').click();

            try {
            await library.findOpenTestcase(testcaseName);
            await expect(page.getByTestId('editable-testcase-title-input')).toHaveValue(testcaseName);
            }
            
            finally {
            await library.deleteTestcase(testcaseName);
            }

        });



        test('Generate with Story pdf @POM @smoke @P1', async ({ page, library }) => {
            await page.locator('input[type="file"][accept="image/*,.pdf"]').setInputFiles(PDFStory);
            await page.locator('[data-testid^="file-description-"]').fill('Generate a unique id and add it to the title of the testcase at the start. It has to be random and alphanumeric.');
            await page.getByRole('button', { name: 'Generate with Story' }).click();
            await expect(page.getByRole('heading', { name: 'SUCCESS' })).toBeVisible({ timeout: 600000 });
            const testcaseName = await page.getByTestId('editable-testcase-title-input').inputValue();
            await expect(testcaseName).toBeTruthy();
            await expect(page.getByRole('button', { name: 'Save Test Case' })).toBeVisible();
            await page.getByRole('button', { name: 'Save Test Case' }).click();
            await expect(page.getByText('Test Case Saved')).toBeVisible();
            await page.getByTestId('alert-dialog-ok-btn').click();
            
            try {
            await library.findOpenTestcase(testcaseName);
            await expect(page.getByTestId('editable-testcase-title-input')).toHaveValue(testcaseName);
            }
            
            finally {
            await library.deleteTestcase(testcaseName);
            }

        });



});