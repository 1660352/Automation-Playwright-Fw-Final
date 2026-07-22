import { BasePage } from '@page-objects/base.page';
import { LoginPage } from '@page-objects/login-page.page';
import { HomePage } from '@page-objects/home-page.page';
import { type test as base } from '@playwright/test';
import { ProfilePage } from '@page-objects/profile-page.page';

export type PageFixtures = {
    basePage: BasePage;
    loginPage: LoginPage;
    homePage: HomePage;
    profilePage: ProfilePage;
};

type ExtendParams = Parameters<typeof base.extend<PageFixtures>>;

export const pageFixtures: ExtendParams[0] = {
    page: async ({ page }, use) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('shopvn_lang', 'en');
        });
        await use(page);
    },
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page))
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page))
    }
};

export { expect } from '@playwright/test';
