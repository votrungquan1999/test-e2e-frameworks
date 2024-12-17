import { test, expect } from "@playwright/test";

test.fail("can not click covered button", async ({ page }) => {
	await page.goto("http://localhost:3000/to-dos");

	const coveredButton = page.locator("#covered-button");

	await expect(coveredButton).toBeVisible();

	// expect this to fail since the button is covered
	await coveredButton.click({
		timeout: 500,
	});
});
