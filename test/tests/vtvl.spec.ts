import { test } from "../fixtures/test.fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

test.describe("Verify page actions over Metamask", async () => {
  test("Sign the message", async ({ recipientDemoPage }) => {
    const walletAddress: string = process.env.ADDRESS!;
    const testMessage: string = faker.hacker.phrase();

    await recipientDemoPage.openPage();
    await recipientDemoPage.checkPageIsLoadedAndReadyToUse();
    await metamask.acceptAccess();
    await recipientDemoPage.verifyMetamaskIsConnected(walletAddress);

    await recipientDemoPage.setWalletAddress(walletAddress);
    await recipientDemoPage.setMessage(testMessage);
    await recipientDemoPage.clickSignTheMessageButton();
    await metamask.confirmPermissionToSpend();

    await recipientDemoPage.verifyReceivedSignatureString();
  });

  test("Verify valid signature", async ({ recipientDemoPage }) => {
    const walletAddress: string = process.env.ADDRESS!;
    const testMessage: string = faker.hacker.phrase();

    await recipientDemoPage.openPage();
    await recipientDemoPage.checkPageIsLoadedAndReadyToUse();
    await metamask.acceptAccess();
    await recipientDemoPage.verifyMetamaskIsConnected(walletAddress);

    await recipientDemoPage.setWalletAddress(walletAddress);
    await recipientDemoPage.setMessage(testMessage);
    await recipientDemoPage.clickSignTheMessageButton();
    await metamask.confirmPermissionToSpend();

    await recipientDemoPage.clickVerifyTheSignatureButton();
    await recipientDemoPage.validSignaturePopupIsDisplayed();
  });

  test("Verify invalid signature pop-up for invalid message text", async ({ recipientDemoPage }) => {
    const walletAddress: string = process.env.ADDRESS!;
    const testMessage1: string = faker.hacker.phrase();

    await recipientDemoPage.openPage();
    await recipientDemoPage.checkPageIsLoadedAndReadyToUse();
    await metamask.acceptAccess();
    await recipientDemoPage.verifyMetamaskIsConnected(walletAddress);

    await recipientDemoPage.setWalletAddress(walletAddress);
    await recipientDemoPage.setMessage(testMessage1);
    await recipientDemoPage.clickSignTheMessageButton();
    await metamask.confirmPermissionToSpend();
    await recipientDemoPage.verifyReceivedSignatureString();

    const testMessage2: string = faker.animal.cat();
    const signature: string = await recipientDemoPage.getSignatureString();
    const splitSignature = ethers.utils.splitSignature(signature);
    const publicKey: string = ethers.utils.verifyMessage(testMessage2, splitSignature);

    await recipientDemoPage.setMessage(testMessage2);
    await recipientDemoPage.clickVerifyTheSignatureButton();
    await recipientDemoPage.invalidSignaturePopupIsDisplayed(publicKey);
  });

  test("Verify invalid signature pop-up for invalid Wallet address", async ({ recipientDemoPage }) => {
    const validWalletAddress: string = process.env.ADDRESS!;
    const invalidWalletAddress: string = "0x" + faker.random.alphaNumeric(40).toUpperCase();
    const testMessage = faker.hacker.phrase();
    const publicKey = ethers.Wallet.fromMnemonic(process.env.SEED_PHRASE!).address;

    await recipientDemoPage.openPage();
    await recipientDemoPage.checkPageIsLoadedAndReadyToUse();
    await metamask.acceptAccess();
    await recipientDemoPage.verifyMetamaskIsConnected(validWalletAddress);

    await recipientDemoPage.setWalletAddress(validWalletAddress);
    await recipientDemoPage.setMessage(testMessage);
    await recipientDemoPage.clickSignTheMessageButton();
    await metamask.confirmPermissionToSpend();

    await recipientDemoPage.setWalletAddress(invalidWalletAddress);
    await recipientDemoPage.clickVerifyTheSignatureButton();
    await recipientDemoPage.invalidSignaturePopupIsDisplayed(publicKey);
  });
});
