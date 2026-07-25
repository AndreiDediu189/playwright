import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Testcases - Analysis', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});



            
        test('User can select multiple test cases and trigger bulk analysis', async ({ page, library }) => {  //needs work just cause combine feature needs work
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
            await library.rightClickTestcase(testcaseName, "COMBINE");
            }

            finally {
            await library.deleteTestcase(testcaseName);
            await library.deleteTestcase(testcaseName2);
            await library.deleteTestcase(testcaseName3);
            }});
});
