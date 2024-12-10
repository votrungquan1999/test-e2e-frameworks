import { Builder, Browser, type WebDriver, By, until } from "selenium-webdriver";
import assert from "node:assert";
import { describe, it, beforeAll, afterAll } from "bun:test";

// This is to check if the tests can be run in parallel
describe("Todo App E2E Tests 2", () => {
	let driver: WebDriver;

	beforeAll(async () => {
		driver = await new Builder().forBrowser(Browser.CHROME).build();
		await driver.get("http://localhost:3000/to-dos");
	});

	it("should be able to add a todo", async () => {
		const timestamp = Date.now();
		const todoText = `Buy groceries ${timestamp}`;

		// Find and fill the input
		const input = await driver.findElement(By.id("todo-input"));
		await input.sendKeys(todoText);

		// Submit the form
		await driver.findElement(By.id("add-todo-button")).click();

		// Wait for the specific todo to appear and verify it
		const todoElement = await driver.wait(
			until.elementLocated(By.xpath(`//span[contains(text(), '${todoText}')]`)),
			5000,
		);

		const text = await todoElement.getText();
		assert.strictEqual(text, todoText);
	});

	it("should be able to toggle a todo", async () => {
		// Find the first todo's toggle button
		const toggleButton = await driver.findElement(By.css("#todo-list li:first-child button[type='submit']"));
		await toggleButton.click();

		// Wait for the completed state to be applied
		await driver.wait(until.elementLocated(By.css("#todo-list li:first-child span.line-through")), 5000);

		// Toggle it back
		await toggleButton.click();

		// Wait for the completed state to be removed
		await driver.wait(async () => {
			const elements = await driver.findElements(By.css("#todo-list li:first-child span.line-through"));
			return elements.length === 0;
		}, 5000);
	});

	it("should be able to delete a todo", async () => {
		// Get the initial count of todos
		const initialTodos = await driver.findElements(By.css("#todo-list li"));
		const initialCount = initialTodos.length;

		// Find and click the delete button of the first todo
		const deleteButton = await driver.findElement(By.css("#todo-list li:first-child button:last-child"));
		await deleteButton.click();

		// Wait for the todo to be removed
		await driver.wait(async () => {
			const currentTodos = await driver.findElements(By.css("#todo-list li"));
			return currentTodos.length === initialCount - 1;
		}, 5000);

		// Verify the todo was deleted
		const finalTodos = await driver.findElements(By.css("#todo-list li"));
		assert.strictEqual(finalTodos.length, initialCount - 1);
	});

	afterAll(async () => {
		await driver.quit();
	});
});
