import { Locator, Page } from "@playwright/test";
import { expect } from "../../test/fixtures/test.fixtures";

export default class HeaderPageComponent {
  private readonly page: Page;
  private readonly connectButton: Locator;
  private readonly connectedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.connectButton = this.page.getByRole("button", { name: "Connect" });
    this.connectedButton = this.page.getByRole("button", { name: "Connected!" });
  }

  async verifyConnectButtonIsVisible() {
    await expect(this.connectButton).toBeVisible();
  }

  async verifyConnectedButtonIsBeVisible() {
    await expect(this.connectedButton).toBeVisible();
  }
};
