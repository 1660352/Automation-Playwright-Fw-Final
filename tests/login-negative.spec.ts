import test, { expect } from '@core/fixtures/all.fixture';
import { ReportUtils } from '@core/utils/report-utils';
import * as allure from "allure-js-commons";

test.describe('Scenario 1: Login fails with blank/wrong credentials', () => {

    test.beforeEach('Navigate to Login Page', async ({ loginPage }) => {
        await allure.step('Navigate to the login page', async () => {
            await loginPage.openUrl();
        });
    });

    test('S1a - Login fails when submitting blank username and password', { tag: "@login" }, async ({ page, loginPage }) => {
        await allure.step('Step 1: Click Login with empty fields', async () => {
            await ReportUtils.attachScreenshot('blank login form', page, async () => {
                await loginPage.clickLoginButton();
            });
        });

        await allure.step('Step 2: Verify user stays on login page (not redirected to /home)', async () => {
            await page.waitForTimeout(1500);
            await ReportUtils.attachScreenshot('after blank submit', page, async () => {
                const url = page.url();
                expect(url).not.toContain('/home');
            });
        });
    });

    test('S1b - Login fails with incorrect credentials', { tag: "@login" }, async ({ page, loginPage }) => {
        await allure.step('Step 1: Enter wrong username and password', async () => {
            await loginPage.doLogin('wronguser', 'wrongpassword');
        });

        await allure.step('Step 2: Wait for server response', async () => {
            await page.waitForTimeout(2000);
        });

        await allure.step('Step 3: Verify user stays on login page', async () => {
            await ReportUtils.attachScreenshot('after wrong credentials', page, async () => {
                const url = page.url();
                expect(url).not.toContain('/home');
            });
        });

        await allure.step('Step 4: Verify error message is displayed', async () => {
            await ReportUtils.attachScreenshot('error message visible', page, async () => {
                const errorEl = page.locator('[class*="error"]');
                await expect(errorEl.first()).toBeVisible({ timeout: 3000 });
            });
        });
    });
});