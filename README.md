# web3-ui-typescript-playwright-synpress-ethers
Simple basic demo project written with TypeScript, Playwright, Synpress, and Ethers for testing Web3 app with Metamask 
wallet

## Tech stack

---
- TypeScript
- Playwright - UI tests
- Ethers - encryption and decryption methods
- Synpress - e2e testing framework based on Cypress.io and Playwright with Metamask support. 
In my case I use Playwright integration.

I am confident that there is no need to create custom integration solutions to work with Metamask.
Rather, it's better to use out-of-the-box solutions. 
I have tested several frameworks for integrating interaction with Metamask. I chose Synpress.
<br>

## Logic

---
### Project

Considering that the automation project is a single-page application, this project is a demonstration of the approach 
to building test automation. It is not intended to show all the possible approaches to building such projects. 
The minimum necessary for the work was used. In particular:
- Page Object pattern
- Page Component pattern
- Test fixtures
- Step methods
- Logic hided from test. Test call only steps



That's it.


This can be further expanded by using the following:
1. Different test suits: sanity, smoke, regression test suits. Or other, depending on project needs.
2. Test actions. Combining test steps into larger actions. <br>
For example: "Establish Metamask connection" action will contain next steps: opening a page, connecting a wallet, 
and checking that the page is ready to use. In this case, the HTML report will have a nice concise look and will have
a number of high-level user-friendly actions.
Single action can be expanded and included steps can be accessed.
3. Helper class for Ether methods and additional helper-methods 
4. Docker containers. Currently, tests run locally and sequentially due to [Playwright's limitations 
over Chrome extensions](https://playwright.dev/docs/chrome-extensions). But this does not matter when running 
tests in Docker containers. 
These limitations are being dropped. Test can be run in parallel and in headless 
mode if needed.

    Couple examples how to run tests in Docker containers: 
    * [Aerokube Moon](https://aerokube.com/moon/). Free up to 4 parallel sessions. 
Best option if K8 available on the project. Ready to use solution with minimum adjustment actions
    * [Selenium grid docker](https://playwright.dev/docs/selenium-grid#using-selenium-docker)
    * [Lambda test](https://www.lambdatest.com/playwright-testing). Quite expensive to use on a small-scale project.
   
5. Add tests to CI pipelines and create quality gates
6. Attaching HTML report to each run on CI

<br>

### Tests
Tests cover the main functions of the application. The goal was not to cover all possible scenarios. This is a demo.

* [playwright.config.ts](playwright.config.ts) Playwright config file. Two projects were configured. One depends on the 
other.
* [connect.metamask.ts](test%2Ftests%2Fconnect.metamask.ts) - This is initial test. Goal - verify if Metamask 
connection can be established. If this test fails, all the others will not run because connection failed.
* [vtvl.spec.ts](test%2Ftests%2Fvtvl.spec.ts) - dependant tests. Cover main function of the app.
* A new browser session is started for each test. Tests are independent on each other.

<br>

#### Covered test cases:
1. Sign the message
   * Set wallet address
   * Set message
   * Sign the message
   * Verify signature string

   <br>
2. Verify valid signature
   * Set wallet address
   * Set message
   * Sign the message
   * Verify valid signature pop-up
   
   <br>
3. Verify invalid signature pop-up for invalid message text
   * Set wallet address
   * Set message1
   * Sign the message
   * Verify signature string
   * Set message2
   * Click Verify the signature button
   * Verify invalid signature pop-up with **"ethers"** lib

   <br>
4. Verify invalid signature pop-up for invalid Wallet address
   * Set valid wallet address
   * Set message
   * Sign the message
   * Set invalid wallet address
   * Click Verify the signature button
   * Verify invalid signature pop-up with **"ethers"** lib


## Getting Started

---


Copy **.env** file:

```bash
cp .env.example .env
```
_Add to .env file required fields: ADDRESS, SEED_PHRASE, PASSWORD_

<br>

Install dependencies:
<br>_with yarn_
```bash
yarn install
```
_with npm_
```bash
npm install
```

<br>

Install chromium browser:
```bash
npx playwright install chromium
```

<br>

Run tests:
<br>_with yarn_
```bash
yarn run test
```
_with npm_
```bash
npm run test
```
<br>

After tests are passed, HTML report should open automatically in the browser. But this action can be triggered manually:
```bash
yarn run show-report
```
<br>

_P.S.: You may notice that the HTML report contains a lot of method calls from Playwright. I've already reported 
an [issue](https://github.com/Synthetixio/synpress/issues/743). 
It's related to Synpress and Metamask integration. I hope it will be fixed soon._

