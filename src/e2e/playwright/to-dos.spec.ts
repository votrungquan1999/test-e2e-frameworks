import { test, expect, type Page } from "@playwright/test";
import { nanoid } from "nanoid";

// This test is used to check the parallel execution of tests
test.describe("Todo List Application 2", () => {
	// Helper function to generate unique todo text
	const uniqueTodoText = (baseText: string) => `${baseText}_${nanoid()}`;

	// Helper function to extract todo ID from the element
	async function getTodoId(page: Page, todoText: string) {
		const todoSpan = page.locator(`span:has-text("${todoText}")`);
		const id = await todoSpan.getAttribute("id");
		return id?.replace("todo-text-", "") || "";
	}

	test.beforeEach(async ({ page }) => {
		// Navigate to the todos page before each test
		await page.goto("/to-dos");
	});

	test("should display the todo list page", async ({ page }) => {
		// Check if the title is present
		await expect(page.locator("h1")).toHaveText("Todo List");

		// Check if the input and add button are present
		await expect(page.locator("#todo-input")).toBeVisible();
		await expect(page.locator("#add-todo-button")).toBeVisible();
	});

	test("should add a new todo", async ({ page }) => {
		const todoText = uniqueTodoText("Buy groceries");

		// Add a new todo
		await page.locator("#todo-input").fill(todoText);
		await page.locator("#add-todo-button").click();

		// Get the todo ID
		const todoId = await getTodoId(page, todoText);

		// Check if the todo was added using specific IDs
		await expect(page.locator(`#todo-item-${todoId}`)).toBeVisible();
		await expect(page.locator(`#todo-text-${todoId}`)).toHaveText(todoText);
	});

	test("should toggle todo completion status", async ({ page }) => {
		// Add a new todo first
		const newTodoText = uniqueTodoText("Test toggle functionality");
		await page.locator("#todo-input").fill(newTodoText);
		await page.locator("#add-todo-button").click();

		// Get the todo ID
		const todoId = await getTodoId(page, newTodoText);

		// Get the toggle button and text element by ID
		const toggleButton = page.locator(`#toggle-todo-${todoId}`);
		const todoTextElement = page.locator(`#todo-text-${todoId}`);

		// Toggle the todo
		await toggleButton.click();

		// Check if the todo text is struck through (completed)
		await expect(todoTextElement).toHaveClass(/line-through/);

		// Toggle again
		await toggleButton.click();

		// Check if the todo text is no longer struck through
		await expect(todoTextElement).not.toHaveClass(/line-through/);
	});

	test("should not add empty todo", async ({ page }) => {
		// Try to add an empty todo
		await page.locator("#todo-input").fill("");
		await page.locator("#add-todo-button").click();

		// Get the initial count of todos
		const initialCount = await page.locator("#todo-list li").count();

		// Verify no new todo was added
		const newCount = await page.locator("#todo-list li").count();
		expect(newCount).toBe(initialCount);
	});
});

test.describe("Todo List Application", () => {
	test.describe.configure({ mode: "serial" });

	// Helper function to generate unique todo text
	const uniqueTodoText = (baseText: string) => `${baseText}_${nanoid()}`;

	// Helper function to extract todo ID from the element
	async function getTodoId(page: Page, todoText: string) {
		const todoSpan = page.locator(`span:has-text("${todoText}")`);
		const id = await todoSpan.getAttribute("id");
		return id?.replace("todo-text-", "") || "";
	}

	test.beforeEach(async ({ page }) => {
		// Navigate to the todos page before each test
		await page.goto("/to-dos");
	});

	test("should display the todo list page", async ({ page }) => {
		// Check if the title is present
		await expect(page.locator("h1")).toHaveText("Todo List");

		// Check if the input and add button are present
		await expect(page.locator("#todo-input")).toBeVisible();
		await expect(page.locator("#add-todo-button")).toBeVisible();
	});

	test("should add a new todo", async ({ page }) => {
		const todoText = uniqueTodoText("Buy groceries");

		// Add a new todo
		await page.locator("#todo-input").fill(todoText);
		await page.locator("#add-todo-button").click();

		// Get the todo ID
		const todoId = await getTodoId(page, todoText);

		// Check if the todo was added using specific IDs
		await expect(page.locator(`#todo-item-${todoId}`)).toBeVisible();
		await expect(page.locator(`#todo-text-${todoId}`)).toHaveText(todoText);
	});

	test("should toggle todo completion status", async ({ page }) => {
		// Add a new todo first
		const newTodoText = uniqueTodoText("Test toggle functionality");
		await page.locator("#todo-input").fill(newTodoText);
		await page.locator("#add-todo-button").click();

		// Get the todo ID
		const todoId = await getTodoId(page, newTodoText);

		// Get the toggle button and text element by ID
		const toggleButton = page.locator(`#toggle-todo-${todoId}`);
		const todoTextElement = page.locator(`#todo-text-${todoId}`);

		// Toggle the todo
		await toggleButton.click();

		// Check if the todo text is struck through (completed)
		await expect(todoTextElement).toHaveClass(/line-through/);

		// Toggle again
		await toggleButton.click();

		// Check if the todo text is no longer struck through
		await expect(todoTextElement).not.toHaveClass(/line-through/);
	});

	test("should delete a todo", async ({ page }) => {
		// Add a new todo first
		const todoText = uniqueTodoText("Delete me");
		await page.locator("#todo-input").fill(todoText);
		await page.locator("#add-todo-button").click();

		// Get the todo ID
		const todoId = await getTodoId(page, todoText);

		// Store the initial count of todos
		const initialCount = await page.locator("#todo-list li").count();

		// Delete the specific todo using its ID
		await page.locator(`#delete-todo-${todoId}`).click();

		// Verify the todo was deleted
		await expect(page.locator("#todo-list li")).toHaveCount(initialCount - 1);

		// Verify the specific todo is no longer present
		await expect(page.locator(`#todo-item-${todoId}`)).toHaveCount(0);
	});

	test("should show empty message when no todos exist", async ({ page }) => {
		// Delete all existing todos
		while ((await page.locator("#todo-list li").count()) > 0) {
			const firstTodoText = await page.locator("#todo-list li span").first().textContent();
			const todoId = await getTodoId(page, firstTodoText || "");
			await page.locator(`#delete-todo-${todoId}`).click();

			// Verify the specific todo is no longer present
			await expect(page.locator(`#todo-item-${todoId}`)).toHaveCount(0);
		}

		// Check if the empty message is displayed
		await expect(page.locator("#empty-message")).toBeVisible();
		await expect(page.locator("#empty-message")).toHaveText("No todos yet. Add one above!");
	});

	test("should not add empty todo", async ({ page }) => {
		// Try to add an empty todo
		await page.locator("#todo-input").fill("");
		await page.locator("#add-todo-button").click();

		// Get the initial count of todos
		const initialCount = await page.locator("#todo-list li").count();

		// Verify no new todo was added
		const newCount = await page.locator("#todo-list li").count();
		expect(newCount).toBe(initialCount);
	});
});
