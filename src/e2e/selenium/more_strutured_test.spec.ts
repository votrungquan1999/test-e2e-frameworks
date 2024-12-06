import { Builder, Browser } from "selenium-webdriver";
import { describe, before, after } from "mocha";

describe("more structured test", () => {

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();

    
  });

  after(async function () {
    await driver.quit();
  });
});
