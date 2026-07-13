import { test as base} from '@playwright/test';
import { library } from './library-page';

type Fixtures = {
  library:library;

};

export const test = base.extend<Fixtures>({
  library: async ({ page }, use) => {
    await use(new library(page));
    
  },
});

export const config = {
    testEmail: process.env.TEST_EMAIL!,
    testPassword: process.env.TEST_PASSWORD!,
    testEmailForResetPassword: process.env.TEST_EMAIL_RESET_PASSWORD!,
    mailosaurApiKey: process.env.MAILOSAUR_API_KEY!,
    mailosaurServerId: process.env.MAILOSAUR_SERVER_ID!,
    openAiKey: process.env.AI_API_KEY!,
};

export { expect } from '@playwright/test';