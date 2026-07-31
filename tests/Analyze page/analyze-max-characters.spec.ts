import { randomUUID } from 'crypto';
import { test, expect } from '../../framework/fixtures';
import { IMGUI } from '../../utils/files';
import { IMGStory } from '../../utils/files';
import { PDFStory } from '../../utils/files';

test.describe('Optional details max character count', () => {
test.beforeEach(async ({ page }) => {       
    await page.goto('/analyze');
    await page.waitForLoadState('domcontentloaded');
});



        test('UI Screenshots optional details max character count (500) @P3', async ({ page }) => {
            await page.locator('input[type="file"][accept="image/*"]').setInputFiles(IMGUI);
            
            while(!(await page.getByText('0 chars left', {exact:true}).isVisible())) {
            await page.locator('[data-testid^="file-description-"]').pressSequentially(randomUUID());
            }
            const description = await page.locator('[data-testid^="file-description-"]').inputValue();
            expect(description.length).toBe(500);

        });

        
        
        test('Story image optional details max character count (500) @P3', async ({ page }) => {
            await page.locator('input[type="file"][accept="image/*,.pdf"]').setInputFiles(IMGStory);

            while(!(await page.getByText('0 chars left', {exact:true}).isVisible())) {
            await page.locator('[data-testid^="file-description-"]').pressSequentially(randomUUID());
            }

        });



        test('Story pdf optional details max character count (500) @P3', async ({ page }) => {
            await page.locator('input[type="file"][accept="image/*,.pdf"]').setInputFiles(PDFStory);
            while(!(await page.getByText('0 chars left', {exact:true}).isVisible())) {
            await page.locator('[data-testid^="file-description-"]').pressSequentially(randomUUID());
            }

        });



});