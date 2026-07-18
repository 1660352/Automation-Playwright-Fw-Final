import { BasePage } from '@page-objects/base.page';
import { LoginPage } from '@page-objects/login-page.page';
import { type test as base } from '@playwright/test';

export type PageFixtures = {
    basePage: BasePage;
    loginPage: LoginPage;
};

type ExtendParams = Parameters<typeof base.extend<PageFixtures>>;

export const pageFixtures: ExtendParams[0] = {
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
};

export { expect } from '@playwright/test';
