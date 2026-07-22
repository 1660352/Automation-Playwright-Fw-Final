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

test('ADMIN - Verify products are displayed in Featured Products section', async ({ page, loginPage, homePage }) => {

    await allure.step('Step 1: Navigate to the login page', async () => {
        await loginPage.openUrl();
    });

    await allure.step('Step 2: Enter valid username and password', async () => {
        await loginPage.doLogin('admin', 'password123');
    });

    await allure.step('Step 4: Verify products are displayed in Featured Products section', async () => {
        await ReportUtils.attachScreenshot("should see featured products", page, async () => {
            await expect(async () => {
                const productCardsCount = await homePage.getProductCardsCount();
                expect(productCardsCount).toBeGreaterThan(0);
            }).toPass();
        });
    });
});

test('USER - Login successfully with valid username and password', async ({ page, loginPage }) => {

    await allure.step('Step 1: Navigate to the login page', async () => {
        await loginPage.openUrl();
    });

    await allure.step('Step 2: Enter valid username and password', async () => {
        await loginPage.doLogin('ate.user1', '12345678');
    });

    await allure.step('Step 3: Verify successful login', async () => {
        await ReportUtils.attachScreenshot("should see home page", page, async () => {
            await expect(page).toHaveURL('/home');
        });
    });
});

test('USER - User able to view user’s profile successfully', async ({ page, loginPage, profilePage, homePage }) => {

    await allure.step('Step 1: Navigate to the login page', async () => {
        await loginPage.openUrl();
    });

    await allure.step('Step 2: Enter valid username and password', async () => {
        await loginPage.doLogin('ate.user1', '12345678');
    });

    await allure.step('Step 3: Go to user profile page', async () => {
        await homePage.clickOnHeaderUsername();
    });

    await allure.step('Step 4: Verify user profile page is displayed', async () => {
        await ReportUtils.attachScreenshot("should see profile page", page, async () => {
            await expect(page).toHaveURL('/profile');
        });
    });

    await allure.step('Step 5: Verify user profile information is displayed correctly', async () => {
        await ReportUtils.attachScreenshot("should see profile information", page, async () => {
            const usernameInputValue = await profilePage.getUserNameInputValue();
            expect(usernameInputValue).toBe('ate.user1');
        });
    });
});