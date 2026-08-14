import test, { expect } from '@core/fixtures/all.fixture';
import { ReportUtils } from '@core/utils/report-utils';
import { ApiHelper } from '@api/api-helper';
import * as allure from "allure-js-commons";
import accounts from '../resources/accounts.json';

const account = accounts.find(a => a.role === 'customer') || { username: '', password: '' };

test.describe('Scenario 5: Checkout with valid receiver info — COD (REQUIRED)', () => {
    let api: ApiHelper;

    test.beforeAll(async () => {
        api = new ApiHelper();
        await api.init();
        await api.login(account.username, account.password);
    });

    test.beforeEach('Login and seed cart', async ({ loginPage, page }) => {
        await api.clearCart();

        await allure.step('Step 1: Navigate to the login page', async () => {
            await loginPage.openUrl();
        });

        await allure.step('Step 2: Login with customer credentials', async () => {
            await loginPage.doLogin(account.username, account.password);
        });

        await allure.step('Step 3: Wait for home page and add a product', async () => {
            await expect(page).toHaveURL('/home');
            await page.waitForSelector('.product-card', { timeout: 15000 });
            await page.locator('.product-card').first().locator('.add-to-cart').click();
            await page.waitForTimeout(500);
        });
    });

    test.afterAll(async () => {
        await api.clearCart();
        await api.dispose();
    });

    test('S5 - Checkout with valid receiver info and COD payment', { tag: "@required" }, async ({ page, checkoutPage }) => {
        await allure.step('Step 1: Navigate to cart', async () => {
            await page.locator('.cart-btn').click();
            await page.waitForURL('**/cart');
        });

        await allure.step('Step 2: Click Proceed to Checkout', async () => {
            await ReportUtils.attachScreenshot('cart before checkout', page, async () => {
                await page.locator('.checkout-btn').click();
                await page.waitForURL('**/checkout');
            });
        });

        await allure.step('Step 3: Fill in recipient information', async () => {
            await checkoutPage.fillRecipientName('Nguyen Van Test');
            await checkoutPage.fillPhone('0901234567');
            await checkoutPage.fillAddress('123 Le Loi, Quan 1, Ho Chi Minh City');
        });

        await allure.step('Step 4: Select COD payment method', async () => {
            await checkoutPage.selectCOD();
        });

        await allure.step('Step 5: Place order', async () => {
            await ReportUtils.attachScreenshot('checkout form filled', page, async () => {
                await checkoutPage.clickPlaceOrder();
            });
        });

        await allure.step('Step 6: Verify order placed successfully', async () => {
            await page.waitForTimeout(3000);
            await ReportUtils.attachScreenshot('order placed', page, async () => {
                // App stays on /checkout and shows success message inline
                const successText = page.locator('text=/Order Placed Successfully/i');
                await expect(successText.first()).toBeVisible({ timeout: 5000 });
            });
        });
    });
});