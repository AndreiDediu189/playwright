import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { config } from './fixtures';
import type { Locator } from '@playwright/test';



export class library {
constructor(private page: Page) {}




async deleteTestcase(testcaseName: string, assertion = true) {

        try {
        await this.page.goto('/testcases');
        await this.page.locator('[data-testid="testcases-search-input"]').fill(testcaseName);
        await this.page.waitForTimeout(5000);

        if (await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).isVisible()) {
        await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click({ button: 'right' });
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('dialog', { name: 'Delete Test Case' })).not.toBeVisible(); 
        }

        else {
        await this.page.getByTestId('toggle-archived-btn').click();
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
        await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click({ button: 'right' });
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('dialog', { name: 'Delete Test Case' })).not.toBeVisible();
        }


}

        catch (e) {
        if (assertion) throw e;
        }
};



async cleanup(testcaseName: string = 'playwright-', assertion = true) {
        try {
        await this.page.goto('/testcases');
        await this.page.locator('[data-testid="testcases-search-input"]').fill(testcaseName);
        await this.page.waitForTimeout(5000);
        while (await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).count() > 0) {
        await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).first().click({ button: 'right' });
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.waitForSelector('[role="dialog"]', { state: 'hidden' });
        }

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
        await this.page.getByTestId('create-testcase-save-btn').click();
        await expect(this.page.getByTestId('alert-dialog-ok-btn')).toBeVisible();
        await this.page.locator('[data-testid="alert-dialog-ok-btn"]').click();
        await expect(this.page.getByTestId('alert-dialog-ok-btn')).not.toBeVisible();
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
        }

        catch (e) {
        if (assertion) throw e;
        }
};



async findTestcase(testcaseName: string, assertion = true): Promise<Locator | null> {

        try {
        await this.page.goto('/testcases');
        await this.page.getByTestId('testcases-search-input').fill(testcaseName);
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
        return this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName });
        }

        catch (e) {
        if (assertion) throw e;
        return null;
        }
};



async rightClickTestcase(testcaseName: string, action: 'ANALYZE' | 'BREAK UP' | 'CSV' | 'TESTRAIL' | 'ARCHIVE' | 'DELETE', assertion = true, breakUpPrompt: string = '') {


        try {
        await expect(this.page).toHaveURL(/testcases/);
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
        await this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName }).click({button: 'right'});
        if (action == 'ANALYZE') await this.page.getByRole('menuitem', { name: 'Analyze' }).click();
        if (action == 'BREAK UP') {
                await this.page.getByRole('menuitem', { name: 'Break Up' }).click();
                await this.page.getByTestId('breakup-testcase-instructions-input').fill(breakUpPrompt);
        };
        if (action == 'CSV') await this.page.getByRole('menuitem', { name: 'Export to CSV' }).click();
        if (action == 'TESTRAIL') await this.page.getByRole('menuitem', { name: 'Export to TestRail' }).click();
        if (action == 'ARCHIVE') await this.page.getByRole('menuitem', { name: 'Archive' }).click();
        if (action == 'DELETE') await this.page.getByRole('menuitem', { name: 'Delete' }).click();
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
        }

        catch (e) {
        if (assertion) throw e;
        }
};



async searchTestcase(testcaseName: string, assertion = true) {


        try {
        await this.page.goto('/testcases');
        await this.page.getByTestId('testcases-search-input').fill(testcaseName);
        await expect(this.page.locator('[data-testid^="testcase-row-title-"]').filter({ hasText: testcaseName })).toBeVisible();
        }

        catch (e) {
        if (assertion) throw e;
        }
};



};