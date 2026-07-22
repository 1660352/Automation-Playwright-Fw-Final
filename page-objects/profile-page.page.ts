import { Page } from "playwright";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly userNameInput = this.page.locator('//label[text()="Username"]//following-sibling::input');

    async getUserNameInputValue(): Promise<string> {
        return await this.getInputValue(this.userNameInput);
    }
}