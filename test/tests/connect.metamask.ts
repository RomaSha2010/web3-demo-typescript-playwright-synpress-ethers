import { test as initial } from "../fixtures/test.fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Initial test.
 * Goal - verify if Metamask connection can be established.
 * If this test fails, all the others will not run because connection failed.
 */
initial("Check Metamask connection", async ({ recipientDemoPage }) => {
  await recipientDemoPage.openPage();
  await recipientDemoPage.checkPageIsLoadedAndReadyToUse();
  await metamask.acceptAccess();
  await recipientDemoPage.verifyMetamaskIsConnected(process.env.ADDRESS!);
});
