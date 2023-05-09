import { Locator, Page } from "@playwright/test";
import { test, expect } from "../../test/fixtures/test.fixtures";
import HeaderPageComponent from "../components/header.page.component";
import ToastifyPopup from "../popups/toastify.popup";

export default class RecipientDemoPage {
  private readonly page: Page;
  private readonly headerPageComponent: HeaderPageComponent;
  private readonly toastifyPopup: ToastifyPopup;
  private readonly walletAddressInput: Locator;
  private readonly messageInput: Locator;
  private readonly signTheMessageButton: Locator;
  private readonly verifyTheSignatureButton: Locator;
  private readonly signatureString: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerPageComponent = new HeaderPageComponent(page);
    this.toastifyPopup = new ToastifyPopup(page);

    this.walletAddressInput = this.page.locator("#address");
    this.messageInput = this.page.locator("#message");
    this.signTheMessageButton = this.page.getByRole("button", { name: "Sign the message" });
    this.verifyTheSignatureButton = this.page.getByRole("button", { name: "Verify the signature" });
    this.signatureString = this.page.getByText("Signature:", { exact: false });
  }

  async openPage() {
    await test.step("Open Recipient Demo page", async () => {
      await this.page.goto("/");
    });
  }

  async checkPageIsLoadedAndReadyToUse() {
    await test.step("Page is loaded and ready to use", async () => {
      await this.headerPageComponent.verifyConnectButtonIsVisible();
      await expect(this.walletAddressInput).toBeVisible();
      await expect(this.messageInput).toBeVisible();
      await expect(this.signTheMessageButton).toBeVisible();
      await expect(this.verifyTheSignatureButton).toBeVisible();
    });
  }

  async verifyMetamaskIsConnected(address: string) {
    await test.step("Metamask wallet connected", async () => {
      // get truncated string with format 0x999...999
      const truncatedAddress: string = address.replace(/^(0x\w{3}).*(\w{3})$/i, "$1...$2");

      await this.headerPageComponent.verifyConnectedButtonIsBeVisible();
      await expect(this.page.getByText(truncatedAddress)).toBeVisible();
    });
  }

  async setWalletAddress(walletAddress: string) {
    await test.step(`Set wallet address "${walletAddress}"`, async () => {
      await this.walletAddressInput.fill(walletAddress);
    });
  }

  async setMessage(testMessage: string) {
    await test.step(`Set message "${testMessage}"`, async () => {
      await this.messageInput.fill(testMessage);
    });
  }

  async clickSignTheMessageButton() {
    await test.step("Click on 'Sign the message' button", async () => {
      await this.signTheMessageButton.click();
    });
  }

  async verifyReceivedSignatureString() {
    await test.step("Verify that signature string is displayed, not empty and has 132 chars", async () => {
      await expect(this.signatureString).toBeVisible();
      await expect(this.signatureString).not.toBeEmpty();

      const signatureCode: string = await this.getSignatureString();
      await expect(signatureCode).toHaveLength(132);
    });
  }

  async getSignatureString(): Promise<string> {
    const signature = await this.signatureString.textContent();
    return signature?.substring(11) ?? "";
  }

  async clickVerifyTheSignatureButton() {
    await test.step("Click on 'Verify the signature' button", async () => {
      await this.verifyTheSignatureButton.click();
    });
  }

  async validSignaturePopupIsDisplayed() {
    await test.step("Valid signature popup is displayed", async () => {
      await this.toastifyPopup.verifyValidSignaturePopupIsDisplayed();
    });
  }

  async invalidSignaturePopupIsDisplayed(publicKey: string) {
    await test.step("Invalid signature popup is displayed", async () => {
      await this.toastifyPopup.verifyInvalidSignaturePopupIsDisplayed(publicKey);
    });
  }
};
