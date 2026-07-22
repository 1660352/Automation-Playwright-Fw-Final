import { Page } from "playwright";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly productGridSection = this.page.locator('div.product-grid');
    private readonly productCards = this.productGridSection.locator('div.product-card');
    private readonly headerUsername = this.page.getByTestId('header-username');

    async clickOnHeaderUsername() {
        await this.clickOnElement(this.headerUsername);
    }

    async getProductCardsCount(): Promise<number> {
        return await this.countElements(this.productCards);
    }
}