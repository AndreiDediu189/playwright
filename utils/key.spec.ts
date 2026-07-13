import { test, expect } from '@playwright/test';


test('Login, set API key', async ({ page, context }) => {
await page.goto('/login');
await page.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_EMAIL!);
await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD!);
await page.getByRole('button', { name: 'Sign in' }).click();
await expect(page.getByRole('heading', { name: 'TEST COMMANDER' })).toBeVisible();
await page.locator('[data-testid="sidebar-ai-key-btn"]').click();
await page.locator('[data-testid="ai-modal-key-input"]').fill(process.env.AI_API_KEY!);
await page.locator('[data-testid="ai-modal-save-btn"]').click();
await context.storageState({ path: './utils/loginstate.json' });
});