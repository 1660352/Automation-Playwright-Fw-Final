import test, { expect } from '@core/fixtures/all.fixture';
import { ReportUtils } from '@core/utils/report-utils';
import * as allure from "allure-js-commons";
import accounts from '../resources/accounts.json';

test.describe('Login Tests - Admin Role', () => {
    var account = accounts.find(account => account.role === 'admin') || { username: '', password: '' };

    test.beforeEach('Navigate to Login Page and perform login', async ({ loginPage }) => {
        await allure.step('Step 1: Navigate to the login page', async () => {
            await loginPage.openUrl();
        });

        await allure.step('Step 2: Enter valid username and password', async () => {
            await loginPage.doLogin(account.username, account.password);
        });
    });

    test('ADMIN - Login successfully with valid username and password', async ({ page }) => {
        await allure.step('Verify successful login', async () => {
            await ReportUtils.attachScreenshot("should see home page", page, async () => {
                await expect(page).toHaveURL('/home');
            });
        });
    });

    test('ADMIN - Verify products are displayed in Featured Products section', async ({ page, homePage }) => {
        await allure.step('Verify products are displayed in Featured Products section', async () => {
            await ReportUtils.attachScreenshot("should see featured products", page, async () => {
                await expect(async () => {
                    const productCardsCount = await homePage.getProductCardsCount();
                    expect(productCardsCount).toBeGreaterThan(0);
                }).toPass();
            });
        });
    });
});

test.describe('Login Tests - Customer Role', () => {
    var account = accounts.find(account => account.role === 'customer') || { username: '', password: '' };

    test.beforeEach('Navigate to Login Page and perform login', async ({ loginPage }) => {
        await allure.step('Step 1: Navigate to the login page', async () => {
            await loginPage.openUrl();
        });

        await allure.step('Step 2: Enter valid username and password', async () => {
            await loginPage.doLogin(account.username, account.password);
        });
    });

    test('Customer - Login successfully with valid username and password', async ({ page }) => {
        await allure.step('Verify successful login', async () => {
            await ReportUtils.attachScreenshot("should see home page", page, async () => {
                await expect(page).toHaveURL('/home');
            });
        });
    });

    test('Customer - User able to view user’s profile successfully', async ({ page, profilePage, homePage }) => {
        await allure.step('Step 1: Go to user profile page', async () => {
            await homePage.clickOnHeaderUsername();
        });

        await allure.step('Step 2: Verify user profile page is displayed', async () => {
            await ReportUtils.attachScreenshot("should see profile page", page, async () => {
                await expect(page).toHaveURL('/profile');
            });
        });

        await allure.step('Step 3: Verify user profile information is displayed correctly', async () => {
            await ReportUtils.attachScreenshot("should see profile information", page, async () => {
                const usernameInputValue = await profilePage.getUserNameInputValue();
                expect(usernameInputValue).toBe('ate.user1');
            });
        });
    });
});