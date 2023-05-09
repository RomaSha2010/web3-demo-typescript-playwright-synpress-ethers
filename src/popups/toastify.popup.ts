import { Locator, Page } from "@playwright/test";
import { expect } from "../../test/fixtures/test.fixtures";

export default class ToastifyPopup {
  private readonly page: Page;
  private readonly popup: Locator;
  private readonly progressbar: Locator;
  private readonly toastIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popup = this.page.getByRole("alert");
    this.progressbar = this.page.getByRole("progressbar", { name: "notification timer" });
    this.toastIcon = this.page.getByRole("img");
  }

  private async validatePopup() {
    await expect(this.popup).toBeVisible();
    await expect(this.progressbar).toHaveCSS("animation-duration", "5s");
  }

  async verifyValidSignaturePopupIsDisplayed() {
    await this.validatePopup();

    await expect(this.toastIcon).toHaveAttribute("fill", "var(--toastify-icon-color-success)");
    await expect(this.page.getByText("Valid signature")).toBeVisible();
  }

  async verifyInvalidSignaturePopupIsDisplayed(publicKey: string) {
    const popupMessage = "Invalid signature. You signed with " + publicKey;
    await this.validatePopup();

    await expect(this.toastIcon).toHaveAttribute("fill", "var(--toastify-icon-color-error)");
    await expect(this.page.getByText(popupMessage)).toBeVisible();
  }
};
