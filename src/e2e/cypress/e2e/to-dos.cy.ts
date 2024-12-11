describe("Todo Application", () => {
	beforeEach(() => {
		cy.visit("/to-dos");
	});

	const createUniqueTodo = (baseText: string) => `${baseText}-${Math.random().toString(36).slice(2, 7)}`;

	it("should display the todo list page", () => {
		cy.get("h1").should("contain", "Todo List");
		cy.get("#todo-input").should("exist");
		cy.get("#add-todo-button").should("exist");
	});

	it("should show empty state message when no todos exist", () => {
		// Delete any existing todos first
		cy.get("body").then(($body) => {
			if ($body.find("#todo-list li").length) {
				cy.get("#todo-list li").each(($el) => {
					cy.wrap($el)
						.invoke("attr", "id")
						.then((todoId) => {
							if (!todoId) throw new Error("Todo ID not found");
							const id = todoId.split("-").pop();
							if (!id) throw new Error("Todo ID not found");

							cy.get(`#delete-todo-${id}`).click();
						});
				});
			}
		});

		// Now verify empty state
		cy.get("#empty-message").should("be.visible");
		cy.get("#empty-message").should("contain", "No todos yet. Add one above!");
	});

	it("should add a new todo", () => {
		const todoText = createUniqueTodo("Buy groceries");
		cy.get("#todo-input").type(todoText);
		cy.get("#add-todo-button").click();

		cy.contains("#todo-list li", todoText)
			.invoke("attr", "id")
			.then((todoId) => {
				if (!todoId) throw new Error("Todo ID not found");
				const id = todoId.split("-").pop();
				if (!id) throw new Error("Todo ID not found");

				cy.get(`#${todoId}`).find(`#todo-text-${id}`).should("contain", todoText);
			});
	});

	it("should toggle todo completion status", () => {
		const todoText = createUniqueTodo("Test toggle functionality");
		cy.get("#todo-input").type(todoText);
		cy.get("#add-todo-button").click();

		cy.contains("#todo-list li", todoText)
			.invoke("attr", "id")
			.then((todoId) => {
				if (!todoId) throw new Error("Todo ID not found");
				const id = todoId.split("-").pop();
				if (!id) throw new Error("Todo ID not found");

				const toggleButton = `#toggle-todo-${id}`;
				const todoText = `#todo-text-${id}`;

				// Toggle on
				cy.get(toggleButton).click();
				cy.get(todoText).should("have.class", "line-through");

				// Toggle off
				cy.get(toggleButton).click();
				cy.get(todoText).should("not.have.class", "line-through");
			});
	});

	it("should delete a todo", () => {
		const todoText = createUniqueTodo("Delete me");
		cy.get("#todo-input").type(todoText);
		cy.get("#add-todo-button").click();

		cy.contains("#todo-list li", todoText)
			.invoke("attr", "id")
			.then((todoId) => {
				if (!todoId) throw new Error("Todo ID not found");
				const id = todoId.split("-").pop();
				if (!id) throw new Error("Todo ID not found");

				// Delete using the specific delete button
				cy.get(`#delete-todo-${id}`).click();

				// Verify todo is removed
				cy.get(`#${todoId}`).should("not.exist");
			});
	});

	it("should not add empty todos", () => {
		// Get initial count of todos
		cy.get("body").then(($body) => {
			const initialCount = $body.find("#todo-list li").length;

			cy.get("#todo-input").type(" ");
			cy.get("#add-todo-button").click();

			// Verify count remains the same
			cy.get("#todo-list li").should("have.length", initialCount);
		});
	});

	it("should handle multiple todos", () => {
		const baseTodos = ["First todo", "Second todo", "Third todo"];
		const todos = baseTodos.map((text) => createUniqueTodo(text));
		const todoIds: string[] = [];

		// Get initial count of todos
		cy.get("body").then(($body) => {
			const initialCount = $body.find("#todo-list li").length;

			// Add multiple todos and store their IDs
			for (const todo of todos) {
				cy.get("#todo-input").type(todo);
				cy.get("#add-todo-button").click();

				cy.contains("#todo-list li", todo)
					.invoke("attr", "id")
					.then((todoId) => {
						if (!todoId) throw new Error("Todo ID not found");
						const id = todoId.split("-").pop();
						if (!id) throw new Error("Todo ID not found");

						todoIds.push(id);
					});
			}

			// Verify all todos exist using their specific IDs
			cy.get("#todo-list li").should("have.length", initialCount + todos.length);
			cy.wrap(todoIds).each((id, index) => {
				cy.get(`#todo-text-${id}`).should("contain", todos[index]);
			});
		});
	});
});
