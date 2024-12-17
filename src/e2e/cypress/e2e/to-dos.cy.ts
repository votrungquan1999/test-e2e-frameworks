describe("Todo Application", () => {
	beforeEach(() => {
		cy.visit("/to-dos");
	});

	const createUniqueTodo = (baseText: string) => `${baseText}-${Math.random().toString(36).slice(2, 7)}`;

	it("should display the todo list page", () => {
		cy.get("h1").should("contain", "Todo List");
		cy.get('input[placeholder="Add a new todo..."]').should("exist");
		cy.contains("button", "Add").should("exist");
	});

	it("should show empty state message when no todos exist", () => {
		// Delete any existing todos first
		cy.get("li").each(($todo) => {
			// Find and click delete button within each todo item
			cy.wrap($todo).within(() => {
				cy.contains("button", "Delete").click();
			});
			// Verify this todo is removed before moving to next
			cy.wrap($todo).should("not.exist");
		});

		// Now verify empty state
		cy.contains("No todos yet. Add one above!").should("be.visible");
	});

	it("should add a new todo", () => {
		const todoText = createUniqueTodo("Buy groceries");

		cy.get('input[placeholder="Add a new todo..."]').type(todoText);
		cy.contains("button", "Add").click();

		// Verify the todo is displayed
		cy.contains("li", todoText).should("be.visible");
	});

	it("should toggle todo completion status", () => {
		const todoText = createUniqueTodo("Test toggle functionality");
		cy.get('input[placeholder="Add a new todo..."]').type(todoText);
		cy.contains("button", "Add").click();

		// Find the todo item and toggle it
		cy.contains("li", todoText).within(() => {
			// Create alias for the toggle button
			cy.get(`[aria-label="Toggle todo: ${todoText}"]`).as("toggleButton");

			// Initial state
			cy.get("@toggleButton").should("have.attr", "aria-pressed", "false");

			// Toggle on
			cy.get("@toggleButton").click();
			cy.get("@toggleButton").should("have.attr", "aria-pressed", "true");
			cy.contains(todoText).should("have.class", "line-through");

			// Toggle off
			cy.get("@toggleButton").click();
			cy.get("@toggleButton").should("have.attr", "aria-pressed", "false");
			cy.contains(todoText).should("not.have.class", "line-through");
		});
	});

	it("should delete a todo", () => {
		const todoText = createUniqueTodo("Delete me");

		cy.get('input[placeholder="Add a new todo..."]').type(todoText);
		cy.contains("button", "Add").click();

		// Verify todo is added before proceeding
		cy.contains("li", todoText).should("be.visible");

		// Delete the todo
		cy.contains("li", todoText).within(() => {
			cy.contains("button", "Delete").click();
		});

		// Verify todo is removed
		cy.contains("li", todoText).should("not.exist");
	});

	it("should not add empty todos", () => {
		// Get initial count of todos
		cy.get("body").then(($body) => {
			const initialCount = $body.find("li").length;

			cy.get('input[placeholder="Add a new todo..."]').type(" ");
			cy.contains("button", "Add").click();

			// Verify count remains the same
			cy.get("li").should("have.length", initialCount);
		});
	});

	it("should handle multiple todos", () => {
		const todos = ["First todo", "Second todo", "Third todo"].map((text) => createUniqueTodo(text));

		// Get initial count of todos
		cy.get("body").then(($body) => {
			const initialCount = $body.find("li").length;

			// Add multiple todos
			for (const todo of todos) {
				cy.get('input[placeholder="Add a new todo..."]').type(todo);
				cy.contains("button", "Add").click();
				cy.contains("li", todo).should("be.visible");
			}

			// Verify all todos exist
			cy.get("li").should("have.length", initialCount + todos.length);
			for (const todo of todos) {
				cy.contains("li", todo).should("be.visible");
			}
		});
	});
});
