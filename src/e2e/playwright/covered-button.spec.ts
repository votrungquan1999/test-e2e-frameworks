import { test, expect } from "@playwright/test";

// example of auto-generated test.
// the result is not as desired, should use AI to generate a better test
test.fail("can not click covered button", async ({ page }) => {
	await page.goto("http://localhost:3000/to-dos");

	const coveredButton = page.locator("#covered-button");

	await expect(coveredButton).toBeVisible();

	await coveredButton.click({
		timeout: 500,
	});

	// expect current page to be "/"
	await expect(page).toHaveURL("/");
});
