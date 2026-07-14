import { test, expect, config } from '../framework/fixtures';
import MailosaurClient from 'mailosaur';
const emailAddress = `test-${Date.now()}@${config.mailosaurServerId}.mailosaur.net`;




test.describe('Login page', () => {
test.beforeEach(async ({ page }) => {
await page.goto('/login');
await page.waitForLoadState('domcontentloaded');
});



        test('Login @smoke @P1', async ({ page }) => {

            await page.getByRole('textbox', { name: 'Email' }).fill(config.testEmail);
            await page.getByRole('textbox', { name: 'Password' }).fill(config.testPassword);
            await page.getByRole('button', { name: 'Sign in' }).click();
            await expect(page.getByRole('heading', { name: 'TEST COMMANDER' })).toBeVisible();
        });



        test('Login With Wrong Credentials @smoke @P2', async ({ page }) => {

            await page.getByRole('textbox', { name: 'Email' }).fill(config.testEmail);
            await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
            await page.getByRole('button', { name: 'Sign in' }).click();
            await expect(page.getByText('Invalid email or password')).toBeVisible();    
        });

        

        test('Create new account @smoke @P1', async ({ page }) => {

            await page.getByRole('button', { name: 'Need an account?' }).click();
            await page.getByRole('textbox', { name: 'Email' }).fill(emailAddress);
            await page.getByRole('textbox', { name: 'Password', exact:true }).fill(config.testPassword);
            await page.getByRole('textbox', { name: 'Confirm Password', exact:true }).fill(config.testPassword);
            const accountCreated = new Date();
            await page.getByRole('button', { name: 'Create account' }).click();
            const mailosaur = new MailosaurClient(config.mailosaurApiKey);
            const message = await mailosaur.messages.get(config.mailosaurServerId, { sentTo: emailAddress }, { receivedAfter: accountCreated });
            const code = message.html!.codes![0].value!;
            await page.keyboard.insertText(code!);
            await page.getByRole('button', { name: 'Verify' }).click();
            await page.waitForResponse(response => response.url().includes('/verify-otp') && response.status() === 200);
            await expect(page.getByRole('heading', { name: 'TEST COMMANDER' })).toBeVisible();
        });



        test('Create new account with existing email @smoke @P3', async ({ page }) => {

            await page.getByRole('button', { name: 'Need an account?' }).click();
            await page.getByRole('textbox', { name: 'Email' }).fill(config.testEmail);
            await page.getByRole('textbox', { name: 'Password', exact:true }).fill(config.testPassword);
            await page.getByRole('textbox', { name: 'Confirm Password', exact:true }).fill(config.testPassword);
            await page.getByRole('button', { name: 'Create account' }).click();
            await expect(page.getByText('A user with this email already exists')).toBeVisible();
        });



        test('Create new account with invalid email @smoke@P3', async ({ page }) => {

            const emailInput = page.locator('input[type="email"]');
            await page.getByRole('button', { name: 'Need an account?' }).click();
            await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
            await page.getByRole('textbox', { name: 'Password', exact:true }).fill(config.testPassword);
            await page.getByRole('textbox', { name: 'Confirm Password', exact:true }).fill(config.testPassword);
            await page.getByRole('button', { name: 'Create account' }).click();
            await expect(emailInput).toHaveJSProperty('validity.typeMismatch', true);
        });



        test('Forgot password @smoke @P1', async ({ page }) => {

            await page.getByRole('button', { name: 'Forgot password?' }).click();
            await page.getByRole('textbox', { name: 'Email' }).fill(config.testEmailForResetPassword);
            const linkSentDate = new Date();
            await page.getByRole('button', { name: 'Send reset link' }).click();
            await page.waitForResponse(response => response.url().includes('/reset-password-request') && response.status() === 200);
            await expect(page.getByText('Please check your email for the password reset link. It may take a few minutes to arrive.')).toBeVisible();
            const mailosaur = new MailosaurClient(config.mailosaurApiKey);
            const resetPasswordMessage = await mailosaur.messages.get(config.mailosaurServerId, { sentTo: config.testEmailForResetPassword }, { receivedAfter: linkSentDate });
            const resetLink = resetPasswordMessage.html!.links![1].href!;
            const newtestpassword = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`.toString();
            await page.goto(resetLink);
            await page.locator('#password').fill(newtestpassword);
            await page.locator('#confirmPassword').fill(newtestpassword);
            await page.getByRole('button', { name: 'Reset Password' }).click();
            await expect(page.getByText('Password reset successful')).toBeVisible();
            await page.getByRole('textbox', { name: 'Email' }).fill(config.testEmailForResetPassword);
            await page.getByRole('textbox', { name: 'Password' }).fill(newtestpassword);
            await page.getByRole('button', { name: 'Sign in' }).click();
            await page.waitForResponse(response => response.url().includes('/analytics/track/batch') && response.status() === 200);
            await expect(page.getByRole('link', { name: 'Image & PDF' })).toBeVisible();

        });



});