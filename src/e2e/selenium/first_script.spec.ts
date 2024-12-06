import { Builder, Browser, By } from "selenium-webdriver";

async function test(){
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  await driver.get("http://localhost:3000");

  await driver.manage().setTimeouts({implicit: 500});


  const title = await driver.getTitle();

  console.log(title);

  // get the a tag with the text "Deploy now"
  const aTag = await driver.findElement(By.linkText("Deploy now"));

  await aTag.click();

  await driver.quit();
}

test();
