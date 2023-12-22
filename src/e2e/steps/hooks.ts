import crypto from "crypto";

import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
import { ChromiumBrowser, chromium } from "@playwright/test";

import { CustomWorld } from "./world";
import { TEST_NETWORKS_STATE, killNode, resetBlockchain } from "../utils";

let browser: ChromiumBrowser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: !!process.env.CI });

  global.crypto = crypto as any;
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();

  // This is a hack which waits for 100ms (local) / 200ms (CI) before setting the redux state
  // So that we can define the needed state in the first step of our scenario
  // It's important to do so BEFORE the page is loaded
  // Otherwise, the state will be overwritten by the redux-persist library
  // just define it like this:
  // (global as any).reduxState = { whatever state you expect }
  // NOTE: if we enable concurrency, then we'll have to address the race conditions
  // TODO: add a way to pass in the accounts (they are stored under persist:accounts)
  this.page.addInitScript(
    state => {
      // if we hit a navigation from inside the app we don't want to
      // override a valid state
      if (localStorage.getItem("persist:root")) {
        return;
      }

      const stateObj: any = {
        _persist: '{"version":-1,"rehydrated":true}',
      };

      // this ensures that the app won't start before we set the state
      localStorage.setItem("E2E_TEST", "true");

      // each value should be a valid JSON string for redux-persist
      Object.keys(state).forEach(key => {
        stateObj[key] = JSON.stringify(state[key]);
      });

      localStorage.setItem("persist:root", JSON.stringify(stateObj));

      // start the app once the startApp function is populated
      // and it's ready to consume the predefined state
      const interval = setInterval(() => {
        if ((window as any).startApp) {
          (window as any).startApp();
          clearInterval(interval);
        }
      }, 10);
    },
    // We need to define the testing network
    // and select it as the current one
    // otherwise, our tests will talk to mainnet by default
    { networks: TEST_NETWORKS_STATE, ...(global as any).reduxState }
  );

  resetBlockchain();
});

After(async function (this: CustomWorld) {
  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
  killNode();
});
