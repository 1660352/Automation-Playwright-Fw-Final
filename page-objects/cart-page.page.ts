import { Page } from "playwright";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly cartTitle = this.page.locator('.cart-title');
    private readonly cartItems = this.page.locator('.cart-item');
    private readonly checkoutBtn = this.page.locator('.checkout-btn');
    private readonly backBtn = this.page.locator('.back-btn');

    getCartItemByName(name: string) {
        return this.cartItems.filter({ has: this.page.locator('.item-name', { hasText: name }) });
    }

    async getCartItemCount(): Promise<number> {
        return await this.countElements(this.cartItems);
    }

    async getCartTitleText(): Promise<string> {
        return (await this.getTextContent(this.cartTitle)) ?? '';
    }

    async getItemQuantity(name: string): Promise<string> {
        const item = this.getCartItemByName(name);
        return (await item.locator('.qty-value').textContent()) ?? '0';
    }

    async removeItem(name: string) {
        const item = this.getCartItemByName(name);
        await item.locator('.remove-btn').click();
    }

    async removeItemByIndex(index: number) {
        await this.cartItems.nth(index).locator('.remove-btn').click();
    }

    async clickCheckout() {
        await this.clickOnElement(this.checkoutBtn);
    }

    async clickBackToShopping() {
        await this.clickOnElement(this.backBtn);
    }

    async getItemTotalPrice(name: string): Promise<string> {
        const item = this.getCartItemByName(name);
        return (await item.locator('.item-total').textContent()) ?? '';
    }
}