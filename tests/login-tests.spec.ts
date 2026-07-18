import test from '@core/fixtures/all.fixture';

test('ADMIN - Login successfully with valid username and password', async ({ page, loginPage }) => {
    await loginPage.openUrl();
    await loginPage.doLogin('admin', 'password123');
    await page.waitForTimeout(2000);
});
