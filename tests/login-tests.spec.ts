import test, { expect } from '@core/fixtures/all.fixture';
import { ReportUtils } from '@core/utils/report-utils';
import * as allure from "allure-js-commons";

test('ADMIN - Login successfully with valid username and password', async ({ page, loginPage }) => {

    await allure.step('Step 1: Navigate to the login page', async () => {
        await loginPage.openUrl();
    });

    await allure.step('Step 2: Enter valid username and password', async () => {
        await loginPage.doLogin('admin', 'password123');
    });

    await allure.step('Step 3: Verify successful login', async () => {
        await ReportUtils.attachScreenshot("should see home page", page, async () => {
            await expect(page).toHaveURL('/home');
        });
    });
});
