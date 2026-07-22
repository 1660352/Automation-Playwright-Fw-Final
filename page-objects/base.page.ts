import { expect, type Locator, type Page } from "@playwright/test";

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openUrl(path: string = "") {
        await this.page.goto(path);
    }

    async enterTxt(element: Locator, text: string) {
        await element.clear();
        await element.fill(text);
    }

    async typeText(element: Locator, text: string, delay: number = 100) {
        await element.pressSequentially(text, { delay });
    }

    async clickOnElement(element: Locator) {
        await element.click();
    }

    async getTextContent(element: Locator) {
        return await element.textContent();
    }

    async getInputValue(element: Locator) {
        return await element.inputValue();
    }

    async hoverOnElement(element: string) {
        return await this.page.hover(element);
    }

    async waitUntilVisible(element: Locator, timeout?: number, message?: string) {
        await expect(element, message).toBeVisible({ timeout });
    }

    async waitUntilHidden(element: Locator, timeout?: number, message?: string) {
        await expect(element, message).toBeHidden({ timeout });
    }

    async waitForPageLoad(loadState?: 'networkidle' | 'load' | 'domcontentloaded') {
        return await this.page.waitForLoadState(loadState);
    }

    async getText(locator: Locator) {
        const elementText = await locator.innerText();
        return elementText;
    }

    async countElements(locator: Locator): Promise<number> {
        return await locator.count();
    }
}
