import test, { expect } from '@core/fixtures/all.fixture';
import { ReportUtils } from '@core/utils/report-utils';
import { ApiHelper } from '@api/api-helper';
import * as allure from "allure-js-commons";
import accounts from '../resources/accounts.json';

const account = accounts.find(a => a.role === 'customer') || { username: '', password: '' };

test.describe('Cart Tests (Scenarios 2, 3, 4)', () => {
    let api: ApiHelper;

    test.beforeAll(async () => {
        api = new ApiHelper();
        await api.init();
        await api.login(account.username, account.password);
    });

    test.beforeEach('Login and go to home', async ({ loginPage }) => {
        await api.clearCart();

        await allure.step('Step 1: Navigate to the login page', async () => {
            await loginPage.openUrl();
        });

        await allure.step('Step 2: Login with customer credentials', async () => {
            await loginPage.doLogin(account.username, account.password);
        });
    });

    test.afterAll(async () => {
        await api.clearCart();
        await api.dispose();
    });

    // ─── Scenario 2 (REQUIRED): Add a single product to cart ─────────
    test('S2 - Add a single product to cart — verify quantity & cart page', { tag: "@required" }, async ({ page, homePage, cartPage }) => {
        let productName = '';

        await allure.step('Step 1: Wait for products to load on home page', async () => {
            await ReportUtils.attachScreenshot('home page loaded', page, async () => {
                await expect(page).toHaveURL('/home');
                await expect(async () => {
                    const count = await homePage.getProductCardsCount();
                    expect(count).toBeGreaterThan(0);
                }).toPass();
            });
        });

        await allure.step('Step 2: Click Add to Cart on the first product', async () => {
            productName = (await page.locator('.product-card').first().locator('.product-name').textContent()) ?? '';
            productName = productName.trim();
            await ReportUtils.attachScreenshot('before add to cart', page, async () => {
                await page.locator('.product-card').first().locator('.add-to-cart').click();
            });
        });

        await allure.step('Step 3: Navigate to cart page', async () => {
            await page.waitForTimeout(500);
            await page.locator('.cart-btn').click();
            await page.waitForURL('**/cart');
        });

        await allure.step('Step 4: Verify cart has exactly 1 item with quantity 1', async () => {
            await ReportUtils.attachScreenshot('cart page with 1 item', page, async () => {
                const itemCount = await cartPage.getCartItemCount();
                expect(itemCount).toBe(1);
                const qty = await cartPage.getItemQuantity(productName);
                expect(qty).toBe('1');
            });
        });

        await allure.step('Step 5: Verify cart title shows correct count', async () => {
            const title = await cartPage.getCartTitleText();
            expect(title).toContain('1');
        });
    });

    // ─── Scenario 3: Add the same product twice ──────────────────────
    test('S3 - Add the same product twice — quantity increments to 2', { tag: "@cart" }, async ({ page, homePage, cartPage }) => {
        let productName = '';

        await allure.step('Step 1: Wait for products to load', async () => {
            await expect(page).toHaveURL('/home');
            await expect(async () => {
                const count = await homePage.getProductCardsCount();
                expect(count).toBeGreaterThan(0);
            }).toPass();
        });

        await allure.step('Step 2: Click Add to Cart on the first product TWICE', async () => {
            productName = (await page.locator('.product-card').first().locator('.product-name').textContent()) ?? '';
            productName = productName.trim();
            await page.locator('.product-card').first().locator('.add-to-cart').click();
            await page.waitForTimeout(500);
            await page.locator('.product-card').first().locator('.add-to-cart').click();
            await page.waitForTimeout(500);
        });

        await allure.step('Step 3: Navigate to cart page', async () => {
            await page.locator('.cart-btn').click();
            await page.waitForURL('**/cart');
        });

        await allure.step('Step 4: Verify quantity is 2 and only 1 line item exists', async () => {
            await ReportUtils.attachScreenshot('cart with qty 2', page, async () => {
                const itemCount = await cartPage.getCartItemCount();
                expect(itemCount).toBe(1);
                const qty = await cartPage.getItemQuantity(productName);
                expect(qty).toBe('2');
            });
        });
    });

    // ─── Scenario 4: Remove item from cart ───────────────────────────
    test('S4 - Remove items from cart', { tag: "@cart" }, async ({ page, homePage, cartPage }) => {
        await allure.step('Step 1: Add two different products to cart', async () => {
            await expect(page).toHaveURL('/home');
            await expect(async () => {
                const count = await homePage.getProductCardsCount();
                expect(count).toBeGreaterThan(1);
            }).toPass();

            await page.locator('.product-card').nth(0).locator('.add-to-cart').click();
            await page.waitForTimeout(500);
            await page.locator('.product-card').nth(1).locator('.add-to-cart').click();
            await page.waitForTimeout(500);
        });

        await allure.step('Step 2: Go to cart and verify 2 items', async () => {
            await page.locator('.cart-btn').click();
            await page.waitForURL('**/cart');
            await ReportUtils.attachScreenshot('cart with 2 items', page, async () => {
                await expect(async () => {
                    const count = await cartPage.getCartItemCount();
                    expect(count).toBe(2);
                }).toPass();
            });
        });

        await allure.step('Step 3: Remove the first item', async () => {
            await ReportUtils.attachScreenshot('before removing first item', page, async () => {
                await cartPage.removeItemByIndex(0);
                await page.waitForTimeout(500);
            });
        });

        await allure.step('Step 4: Verify 1 item remains', async () => {
            await ReportUtils.attachScreenshot('after removing first item', page, async () => {
                await expect(async () => {
                    const count = await cartPage.getCartItemCount();
                    expect(count).toBe(1);
                }).toPass();
            });
        });

        await allure.step('Step 5: Remove the last item', async () => {
            await cartPage.removeItemByIndex(0);
            await page.waitForTimeout(500);
        });

        await allure.step('Step 6: Verify cart is empty', async () => {
            await ReportUtils.attachScreenshot('empty cart', page, async () => {
                const count = await cartPage.getCartItemCount();
                expect(count).toBe(0);
            });
        });
    });
});