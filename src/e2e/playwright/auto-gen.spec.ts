import { test, expect } from "@playwright/test";

// example of auto-generated test.
// the result is not as desired, should use AI to generate a better test
test.skip("todo workflow - add, complete, and delete", async ({ page }) => {
	await page.goto("http://localhost:3000/to-dos");

	// Add new todo
	await page.getByPlaceholder("Add a new todo...").click();
	await page.getByPlaceholder("Add a new todo...").fill("def ghi");
	await page.getByPlaceholder("Add a new todo...").press("Enter");
	await page.getByRole("button", { name: "Add" }).click();

	// Verify todo is added
	await expect(page.getByText("def ghi")).toBeVisible();

	// Mark as completed
	await page.getByRole("button", { name: "0" }).click();
	await page.getByRole("button", { name: "Completed todo" }).click();

	// Verify todo is marked as completed
	await expect(page.getByRole("button", { name: "Completed todo" })).toBeVisible();

	// Delete todo
	await page.getByRole("button", { name: "Delete" }).click();

	// Verify todo is deleted and empty state message is shown
	await expect(page.getByText("No todos yet. Add one above!")).toBeVisible();
});
