import test, { expect } from "@core/fixtures/all.fixture";
import { ReportUtils } from "@core/utils/report-utils";
import { ApiHelper } from "@api/api-helper";
import * as allure from "allure-js-commons";
import accounts from "../resources/accounts.json";

const account = accounts.find((a) => a.role === "customer") || {
  username: "",
  password: "",
};

test.describe("Scenario 6: Update Full Name then clean up via API (REQUIRED)", () => {
  let api: ApiHelper;
  let originalName: string;

  test.beforeAll(async () => {
    api = new ApiHelper();
    await api.init();
    await api.login(account.username, account.password);
    // Save original name for cleanup
    const profile = await api.getProfile();
    originalName = profile.name;
  });

  test.beforeEach("Login", async ({ loginPage, page }) => {
    await allure.step("Step 1: Navigate to the login page", async () => {
      await loginPage.openUrl();
    });

    await allure.step("Step 2: Login with customer credentials", async () => {
      await loginPage.doLogin(account.username, account.password);
    });

    await allure.step("Step 3: Wait for home page", async () => {
      await expect(page).toHaveURL("/home");
    });
  });

  test.afterAll(async () => {
    // Always restore original name
    await api.updateProfile(originalName);
    await api.dispose();
  });

  test(
    "Scenario 6 - Update Full Name on profile page then restore via API",
    { tag: "@required" },
    async ({ page, profilePage, homePage }) => {
      const newName = "Automation Test User " + Date.now();

      await allure.step("Step 1: Navigate to Profile page", async () => {
        await homePage.clickOnHeaderUsername();
        await expect(page).toHaveURL("/profile");
      });

      await allure.step(
        "Step 2: Verify current name is displayed",
        async () => {
          await ReportUtils.attachScreenshot(
            "profile before update",
            page,
            async () => {
              await page.waitForLoadState("networkidle");
              const currentName = await profilePage.getFullNameInputValue();
              expect(currentName).toBeTruthy();
            },
          );
        },
      );

      await allure.step("Step 3: Update Full Name", async () => {
        await ReportUtils.attachScreenshot(
          "filling new name",
          page,
          async () => {
            await profilePage.updateFullName(newName);
          },
        );
      });

      await allure.step(
        "Step 4: Verify name persisted on page reload",
        async () => {
          await page.waitForTimeout(1000);
          await page.reload();
          await page.waitForLoadState("networkidle");
          await ReportUtils.attachScreenshot(
            "profile after update",
            page,
            async () => {
              await expect(async () => {
                const updatedName = await profilePage.getFullNameInputValue();
                expect(updatedName).toBe(newName);
              }).toPass({ timeout: 5000 });
            },
          );
        },
      );

      await allure.step("Step 5: Verify name updated via API", async () => {
        const profile = await api.getProfile();
        expect(profile.name).toBe(newName);
      });

      await allure.step(
        "Step 6: Clean up — restore original name via API",
        async () => {
          const restored = await api.updateProfile(originalName);
          expect(restored.name).toBe(originalName);
        },
      );

      await allure.step(
        "Step 7: Verify cleanup — reload profile and confirm original name",
        async () => {
          await page.reload();
          await page.waitForLoadState("networkidle");
          await ReportUtils.attachScreenshot(
            "profile after cleanup",
            page,
            async () => {
              await expect(async () => {
                const restoredName = await profilePage.getFullNameInputValue();
                expect(restoredName).toBe(originalName);
              }).toPass({ timeout: 5000 });
            },
          );
        },
      );
    },
  );
});
