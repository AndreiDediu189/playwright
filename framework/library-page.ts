import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { config } from './fixtures';



export class library {
constructor(private page: Page) {}

async deleteTestcase(testcaseName: string, assertion = true) {

        try {
        await this.page.goto('/testcases');
        await this.page.locator('[data-testid="testcases-search-input"]').fill(testcaseName);
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
        await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click({ button: 'right' });
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('dialog', { name: 'Delete Test Case' })).not.toBeVisible(); // i want to have a separate timeout just for when there is no assertion otherwise my tests will hang even when passed like or example project was deleted with testcase so deletion method is waiting forever ro find project to delete
        await this.page.waitForLoadState('domcontentloaded');
        }

        catch (e) {
        if (assertion) throw e;
        }
};

async cleanup(testcaseName: string = 'playwright-', assertion = true) {

        try {
        await this.page.goto('/testcases');
        await this.page.locator('[data-testid="testcases-search-input"]').fill(testcaseName);
        while (await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).count() > 0) {
        await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).first().click({ button: 'right' });
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('dialog', { name: 'Delete Test Case' })).not.toBeVisible(); // i want to have a separate timeout just for when there is no assertion otherwise my tests will hang even when passed like or example project was deleted with testcase so deletion method is waiting forever ro find project to delete
        }
        await this.page.waitForLoadState('domcontentloaded');
        }

        catch (e) {
        if (assertion) throw e;
        }
};

async setAPIKey(apiKey = config.openAiKey, assertion = true){

        try {
        await this.page.locator('[data-testid="sidebar-ai-key-btn"]').click();
        await this.page.locator('[data-testid="ai-modal-key-input"]').fill(apiKey);
        await this.page.locator('[data-testid="ai-modal-save-btn"]').click();
        }

        catch (e) {
        if (assertion) throw e;
        }
};



async createTestcase(testcaseName: string = 'Default string - Manual testcase for testing. Make sure to delete.', testcaseStory: string = 'PROJ-123', assertion = true) {

        try {
        await this.page.goto('/testcases');
        await this.page.getByRole('button', { name: 'Create Test Case' }).click();
        await this.page.getByTestId('editable-testcase-title-input').fill(testcaseName);
        await this.page.getByTestId('editable-testcase-jira-key-input').fill(testcaseStory);
        await this.page.getByTestId('editable-testcase-preconditions-input').fill('Testcase preconditions');
        await this.page.getByRole('button', { name: 'Add Step' }).click();
        await this.page.getByTestId('editable-testcase-step-action-input-1').fill('Open the application');
        await this.page.getByTestId('editable-testcase-step-expected-result-input-1').fill('Application is opened');
        await this.page.getByRole('button', { name: 'Add Step' }).click();   
        await this.page.getByTestId('editable-testcase-step-action-input-2').fill('Navigate to the login page');
        await this.page.getByTestId('editable-testcase-step-expected-result-input-2').fill('Login form is displayed');
        await this.page.getByRole('button', { name: 'Add Step' }).click();
        await this.page.getByTestId('editable-testcase-step-action-input-3').fill('Fill in the email and password fields');
        await this.page.getByTestId('editable-testcase-step-expected-result-input-3').fill('The credentials are filled in');
        await this.page.getByRole('button', { name: 'Add Step' }).click();
        await this.page.getByTestId('editable-testcase-step-action-input-4').fill('Click the login button');  
        await this.page.getByTestId('editable-testcase-step-expected-result-input-4').fill('User is logged in');              
        await this.page.getByTestId('editable-testcase-notes-input').fill('Notes go here');   
        await this.page.getByRole('button', { name: 'Save Test Case' }).click();
        await expect(this.page.getByTestId('alert-dialog-ok-btn')).toBeVisible();
        await this.page.locator('[data-testid="alert-dialog-ok-btn"]').click();
        await expect(this.page.getByTestId('alert-dialog-ok-btn')).not.toBeVisible();
        await this.page.waitForLoadState('domcontentloaded');
        }

        catch (e) {
        if (assertion) throw e;
        }
};



async findOpenTestcase(testcaseName: string, assertion = true) {

        try {
        await this.page.goto('/testcases');
        await this.page.getByTestId('testcases-search-input').fill(testcaseName);
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
        await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click();
        await this.page.waitForLoadState('domcontentloaded');
        }

        catch (e) {
        if (assertion) throw e;
        }
};



async findTestcase(testcaseName: string, assertion = true) {

        try {
        await this.page.goto('/testcases');
        await this.page.getByTestId('testcases-search-input').fill(testcaseName);
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
        await this.page.waitForLoadState('domcontentloaded');
        }

        catch (e) {
        if (assertion) throw e;
        }
};



async changeTestcaseStatus(testcaseName: string, status: 'DRAFT' | 'READY' | 'IN PROGRESS' | 'COMPLETED', assertion = true) {

        try {
        await this.page.goto('/testcases');
        await this.page.getByTestId('testcases-search-input').fill(testcaseName);
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();  
        await this.page.locator('[data-testid^="testcase-row-"]').filter({ hasText: testcaseName }).getByRole('combobox').click();
        await this.page.getByRole('option', { name: status }).click();
        await expect(this.page.locator('[data-testid^="testcase-row-"]').filter({ hasText: testcaseName }).getByRole('combobox')).toHaveText(status);
        await this.page.waitForLoadState('domcontentloaded');
        }

        catch (e) {
        if (assertion) throw e;
        }
};


};