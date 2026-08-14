import { Page } from "playwright";
import { BasePage } from "./base.page";

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly recipientNameInput = this.page.getByTestId('checkout-name');
    private readonly phoneInput = this.page.getByTestId('checkout-phone');
    private readonly addressInput = this.page.getByTestId('checkout-address');
    private readonly placeOrderBtn = this.page.getByTestId('checkout-submit');
    private readonly backBtn = this.page.getByTestId('checkout-back');
    private readonly codRadio = this.page.locator('input[name="paymentMethod"][value="cash"]');
    private readonly cardRadio = this.page.locator('input[name="paymentMethod"][value="card"]');
    private readonly totalPrice = this.page.locator('.summary-total-price');

    async fillRecipientName(name: string) {
        await this.enterTxt(this.recipientNameInput, name);
    }

    async fillPhone(phone: string) {
        await this.enterTxt(this.phoneInput, phone);
    }

    async fillAddress(address: string) {
        await this.enterTxt(this.addressInput, address);
    }

    async selectCOD() {
        await this.codRadio.check();
    }

    async selectCard() {
        await this.cardRadio.check();
    }

    async clickPlaceOrder() {
        await this.clickOnElement(this.placeOrderBtn);
    }

    async clickBack() {
        await this.clickOnElement(this.backBtn);
    }

    async getTotalPrice(): Promise<string> {
        return (await this.getTextContent(this.totalPrice)) ?? '';
    }

    async fillAndSubmitCOD(name: string, phone: string, address: string) {
        await this.fillRecipientName(name);
        await this.fillPhone(phone);
        await this.fillAddress(address);
        await this.selectCOD();
        await this.clickPlaceOrder();
    }
}