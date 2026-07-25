import { test } from '../framework/fixtures';






test('global teardown', async ({library}) => {
    await library.cleanup();
});