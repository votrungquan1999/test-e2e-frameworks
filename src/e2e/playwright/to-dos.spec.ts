import { test, expect, type Page } from "@playwright/test";
import { nanoid } from "nanoid";

// This test is used to check the parallel execution of tests
test.describe.skip("Parallel Execution test setup", () => {
	// Helper function to generate unique todo text
	const uniqueTodoText = (baseText: string) => `${baseText}_${nanoid()}`;

	// Helper function to extract todo ID from the element
	async function getTodoId(page: Page, todoText: string) {
		const todoSpan = page.locator(`span:has-text("${todoText}")`).first();
		const id = await todoSpan.getAttribute("id");
		return id?.replace("todo-text-", "") || "";
	}

	test.beforeEach(async ({ page }) => {
		await page.goto("/to-dos");
	});

	test("should display the todo list page", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "Todo List" })).toBeVisible();
		await expect(page.getByPlaceholder("Add a new todo...")).toBeVisible();
		await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
	});

	test("should add a new todo", async ({ page }) => {
		const todoText = uniqueTodoText("Buy groceries");

		await page.getByPlaceholder("Add a new todo...").fill(todoText);
		await page.getByRole("button", { name: "Add" }).click();

		await expect(page.getByText(todoText)).toBeVisible();
	});

	test("should toggle todo completion status", async ({ page }) => {
		const todoText = uniqueTodoText("Test toggle functionality");

		await page.getByPlaceholder("Add a new todo...").fill(todoText);
		await page.getByRole("button", { name: "Add" }).click();

		const todoId = await getTodoId(page, todoText);

		const toggleButton = page.locator(`#toggle-todo-${todoId}`);
		const todoTextElement = page.locator(`#todo-text-${todoId}`);

		await toggleButton.click();
		await expect(todoTextElement).toHaveClass(/line-through/);

		await toggleButton.click();
		await expect(todoTextElement).not.toHaveClass(/line-through/);
	});

	test("should not add empty todo", async ({ page }) => {
		const initialCount = await page.getByRole("listitem").count();

		await page.getByPlaceholder("Add a new todo...").fill(" ");
		await page.getByRole("button", { name: "Add" }).click();

		await expect(page.getByRole("listitem")).toHaveCount(initialCount);
	});
});

test.describe("Todo List Application", () => {
	test.describe.configure({ mode: "serial" });

	const uniqueTodoText = (baseText: string) => `${baseText}_${nanoid()}`;

	test.beforeEach(async ({ page }) => {
		await page.goto("/to-dos");
	});

	test("should display the todo list page", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "Todo List" })).toBeVisible();
		await expect(page.getByPlaceholder("Add a new todo...")).toBeVisible();
		await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
	});

	test("should add a new todo", async ({ page }) => {
		const todoText = uniqueTodoText("Buy groceries");

		await page.getByPlaceholder("Add a new todo...").fill(todoText);
		await page.getByRole("button", { name: "Add" }).click();

		await expect(page.getByRole("listitem").filter({ hasText: todoText })).toBeVisible();
	});

	test("should toggle todo completion status", async ({ page }) => {
		const todoText = uniqueTodoText("Test toggle functionality");

		await page.getByPlaceholder("Add a new todo...").fill(todoText);
		await page.getByRole("button", { name: "Add" }).click();

		const todoItem = page.getByRole("listitem").filter({ hasText: todoText });
		const toggleButton = page.getByRole("button", { name: `Toggle todo: ${todoText}` });
		const todoTextElement = todoItem.getByText(todoText);

		// Initial state
		await expect(toggleButton).toHaveAttribute("aria-pressed", "false");

		// Toggle on
		await toggleButton.click();
		await expect(toggleButton).toHaveAttribute("aria-pressed", "true");
		await expect(todoTextElement).toHaveClass(/line-through/);

		// Toggle off
		await toggleButton.click();
		await expect(toggleButton).toHaveAttribute("aria-pressed", "false");
		await expect(todoTextElement).not.toHaveClass(/line-through/);
	});

	test("should delete a todo", async ({ page }) => {
		const todoText = uniqueTodoText("Delete me");

		await page.getByPlaceholder("Add a new todo...").fill(todoText);
		await page.getByRole("button", { name: "Add" }).click();

		const todoItem = page.getByRole("listitem").filter({ hasText: todoText });

		// Verify todo is added before proceeding
		await expect(todoItem).toBeVisible();

		const initialCount = await page.getByRole("listitem").count();

		await todoItem.getByRole("button", { name: "Delete", exact: true }).click();

		await expect(page.getByRole("listitem")).toHaveCount(initialCount - 1);
		await expect(page.getByText(todoText)).not.toBeVisible();
	});

	test("should show empty message when no todos exist", async ({ page }) => {
		while ((await page.getByRole("listitem").count()) > 0) {
			await page.getByRole("button", { name: "Delete" }).first().click();
		}

		await expect(page.getByText("No todos yet. Add one above!")).toBeVisible();
	});

	test("should not add empty todo", async ({ page }) => {
		const initialCount = await page.getByRole("listitem").count();

		await page.getByPlaceholder("Add a new todo...").fill(" ");
		await page.getByRole("button", { name: "Add" }).click();

		await expect(page.getByRole("listitem")).toHaveCount(initialCount);
	});

	test("should handle multiple todos", async ({ page }) => {
		const todos = [uniqueTodoText("First todo"), uniqueTodoText("Second todo"), uniqueTodoText("Third todo")];

		const initialCount = await page.getByRole("listitem").count();

		for (const todo of todos) {
			await page.getByPlaceholder("Add a new todo...").fill(todo);
			await page.getByRole("button", { name: "Add" }).click();

			// Verify each todo is visible after adding
			await expect(page.getByRole("listitem").filter({ hasText: todo })).toBeVisible();
		}

		// Verify total count and each todo's text
		await expect(page.getByRole("listitem")).toHaveCount(initialCount + todos.length);
		for (const todo of todos) {
			await expect(page.getByRole("listitem").filter({ hasText: todo })).toBeVisible();
		}
	});
});
