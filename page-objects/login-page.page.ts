import { Page } from "playwright";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly usernameInput = this.page.locator("#username");
    private readonly passwordInput = this.page.locator("#password");
    private readonly loginButton = this.page.getByTestId("login-submit");

    async fillUsername(username: string) {
        await this.enterTxt(this.usernameInput, username);
    }

    async fillPassword(password: string) {
        await this.enterTxt(this.passwordInput, password);
    }

    async clickLoginButton() {
        await this.clickOnElement(this.loginButton);
    }

    async doLogin(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }
}