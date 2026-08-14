import { Page } from "playwright";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly userNameInput = this.page.locator('//label[text()="Username"]//following-sibling::input');
    private readonly fullNameInput = this.page.locator('//label[text()="Full Name"]//following-sibling::input');
    private readonly saveBtn = this.page.locator('button[type="submit"]');

    async getUserNameInputValue(): Promise<string> {
        return await this.getInputValue(this.userNameInput);
    }

    async getFullNameInputValue(): Promise<string> {
        return await this.getInputValue(this.fullNameInput);
    }

    async fillFullName(name: string) {
        await this.enterTxt(this.fullNameInput, name);
    }

    async clickSave() {
        await this.clickOnElement(this.saveBtn);
    }

    async updateFullName(name: string) {
        await this.fillFullName(name);
        await this.clickSave();
    }
}