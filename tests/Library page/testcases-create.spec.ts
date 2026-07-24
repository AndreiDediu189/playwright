import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';
import { IMGStory } from '../../utils/files';

test.describe('Testcases - Create', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

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


        test('User can attach image files in the create modal @P3', async ({ page }) => {
            await page.getByTestId('testcases-create-btn').click();
            await page.getByTestId('create-testcase-file-input').setInputFiles(IMGStory);
            await expect(page.getByText('ImgStory.png')).toBeVisible();
            });


        test('User can generate testcase using image @Smoke', async ({ page, library }) => {
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

});
