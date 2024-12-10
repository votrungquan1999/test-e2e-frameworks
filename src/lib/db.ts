// Type for our todo item
type Todo = {
	id: number;
	text: string;
	completed: boolean;
};

// Types for query parameters
type InsertParams = [text: string, completed: number];
type UpdateParams = [id: number];
type DeleteParams = [id: number];
type QueryParams = InsertParams | UpdateParams | DeleteParams;

// In-memory store
class InMemoryDb {
	private todos: Todo[] = [];
	private nextId = 1;

	query() {
		return {
			all: () => [...this.todos].sort((a, b) => b.id - a.id),
		};
	}

	run(query: string, params: QueryParams) {
		if (query.includes("INSERT")) {
			const [text, completed] = params as InsertParams;
			this.todos.push({
				id: this.nextId++,
				text,
				completed: completed === 1,
			});
		} else if (query.includes("UPDATE")) {
			const [id] = params as UpdateParams;
			const todo = this.todos.find((t) => t.id === id);
			if (todo) {
				todo.completed = !todo.completed;
			}
		} else if (query.includes("DELETE")) {
			const [id] = params as DeleteParams;
			this.todos = this.todos.filter((t) => t.id !== id);
		}
	}
}

let db: InMemoryDb;

export function getDb() {
	if (!db) {
		db = new InMemoryDb();
	}
	return db;
}
