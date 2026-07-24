import { test, expect } from '../../framework/fixtures';
import { randomUUID } from 'crypto';

test.describe('Testcases - Drag and Drop', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('/testcases');
    await page.waitForLoadState('domcontentloaded');
});

test.describe.serial('Non-parallel @manual', () => {

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
            await page.waitForTimeout(5000);

        const testcaseRowAfterUpdate = await page.locator('[data-testid^="testcase-row-title-"]').first().textContent();
        const testcaseRowAfterUpdate2 = await page.locator('[data-testid^="testcase-row-title-"]').nth(1).textContent();
            await expect(testcaseRow2).toBe(testcaseRowAfterUpdate);
            await expect(testcaseRow).toBe(testcaseRowAfterUpdate2);
        });


        test('User can drag and drop testcases to different statuses', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            const readyCard = await library.getMiddleOfElement(page.locator('[data-status-key="ready"]'));
            const inProgressCard = await library.getMiddleOfElement(page.locator('[data-status-key="in_progress"]'));
            const completedCard = await library.getMiddleOfElement(page.locator('[data-status-key="completed"]'));
            const draftCard = await library.getMiddleOfElement(page.locator('[data-status-key="draft"]'));
            const dragHandle = await library.getMiddleOfElement((await library.findTestcaseOnPage(testcaseName))!.locator('[data-testid^=testcase-row-drag-handle]'));

            await page.mouse.move(dragHandle.x, dragHandle.y);
            await page.mouse.down();
            await page.waitForTimeout(1000);
            await page.mouse.move(readyCard.x, readyCard.y, {steps:10});
            await page.waitForTimeout(1000);
            await page.mouse.up();
            await page.waitForTimeout(1000);
            await page.mouse.click(readyCard.x, readyCard.y);
            await page.waitForTimeout(1000);
            await library.searchForTestcase(testcaseName);

            await page.mouse.move(dragHandle.x, dragHandle.y);
            await page.mouse.down();
            await page.waitForTimeout(1000);
            await page.mouse.move(inProgressCard.x, inProgressCard.y, {steps:10});
            await page.waitForTimeout(1000);
            await page.mouse.up();
            await page.waitForTimeout(1000);
            await page.mouse.click(inProgressCard.x, inProgressCard.y);
            await page.waitForTimeout(1000);
            await library.searchForTestcase(testcaseName);

            await page.mouse.move(dragHandle.x, dragHandle.y);
            await page.mouse.down();
            await page.waitForTimeout(1000);
            await page.mouse.move(completedCard.x, completedCard.y, {steps:10});
            await page.waitForTimeout(1000);
            await page.mouse.up();
            await page.waitForTimeout(1000);
            await page.mouse.click(completedCard.x, completedCard.y);
            await page.waitForTimeout(1000);
            await library.searchForTestcase(testcaseName);

            await page.mouse.move(dragHandle.x, dragHandle.y);
            await page.mouse.down();
            await page.waitForTimeout(1000);
            await page.mouse.move(draftCard.x, draftCard.y, {steps:10});
            await page.waitForTimeout(1000);
            await page.mouse.up();
            await page.waitForTimeout(1000);
            await page.mouse.click(draftCard.x, draftCard.y);
            await page.waitForTimeout(1000);
            await library.searchForTestcase(testcaseName);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});


        test('User can drag and drop to reorder steps @P2', async ({ page, library }) => {
        const testcaseName = `playwright-${randomUUID()}`;
        await library.createTestcase(testcaseName);

            try {
            await library.findOpenTestcase(testcaseName);
            await page.getByTestId('editable-testcase-step-action-input-3').scrollIntoViewIfNeeded();
            const step3 = await page.getByTestId('editable-testcase-step-action-input-3').inputValue();

            const step3HandleBox = await page.locator('[data-rfd-drag-handle-draggable-id="step-2"]').boundingBox();
            const step3HandleMiddle = { x: step3HandleBox!.x + step3HandleBox!.width/2, y: step3HandleBox!.y + step3HandleBox!.height/2 };
            const step2HandleBox = await page.locator('[data-rfd-drag-handle-draggable-id="step-1"]').boundingBox();
            const step2HandleMiddle = { x: step2HandleBox!.x + step2HandleBox!.width/2, y: step2HandleBox!.y + step2HandleBox!.height/2 };

            await page.mouse.move(step3HandleMiddle.x, step3HandleMiddle.y);
            await page.mouse.down();
            await page.mouse.move(step2HandleMiddle.x, step2HandleMiddle.y, {steps: 10});
            await page.mouse.up();
            await page.waitForTimeout(1000);

            const step2 = await page.getByTestId('editable-testcase-step-action-input-2').inputValue();
            expect(step3).toBe(step2);
            }

            finally {
            await library.deleteTestcase(testcaseName);
            }});

});

});
