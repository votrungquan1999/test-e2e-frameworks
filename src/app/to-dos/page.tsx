"use cache";

import { cacheLife } from "next/dist/server/use-cache/cache-life";
import {
	getTodos,
	addTodo as addTodoAction,
	toggleTodo as toggleTodoAction,
	deleteTodo as deleteTodoAction,
} from "./actions";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { revalidateTag } from "next/cache";

export default async function TodosPage() {
	cacheLife("minutes");
	cacheTag("todos");

	const todos = await getTodos();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
			<div className="container mx-auto px-4 py-12">
				<div className="bg-white rounded-xl shadow-lg p-8 min-h-[700px]">
					<h1 className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
						Todo List
					</h1>

					<div className="max-w-3xl mx-auto">
						<form action={addTodo} className="mb-10">
							<div className="flex gap-4">
								<input
									type="text"
									name="text"
									placeholder="Add a new todo..."
									className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									required
								/>
								<button
									type="submit"
									className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-md whitespace-nowrap"
								>
									Add
								</button>
							</div>
						</form>

						<ul className="space-y-5">
							{todos.map((todo) => (
								<li
									key={todo.id}
									className="flex items-center gap-4 p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow transition-all duration-200"
								>
									<form action={toggleTodo} className="flex-1 flex items-center gap-4">
										<input type="hidden" name="id" value={todo.id} />
										<button
											type="submit"
											className="h-6 w-6 rounded border border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
										>
											{todo.completed && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="w-5 h-5"
													aria-label="Completed todo"
													role="img"
												>
													<path
														fillRule="evenodd"
														d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
														clipRule="evenodd"
													/>
												</svg>
											)}
										</button>
										<span
											className={`flex-1 text-lg text-gray-700 ${todo.completed ? "line-through text-gray-400" : ""}`}
										>
											{todo.text}
										</span>
									</form>
									<form action={deleteTodo}>
										<input type="hidden" name="id" value={todo.id} />
										<button
											type="submit"
											className="px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
										>
											Delete
										</button>
									</form>
								</li>
							))}
						</ul>
						{todos.length === 0 && (
							<p className="text-center text-gray-500 mt-12 text-lg">No todos yet. Add one above!</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

async function addTodo(formData: FormData) {
	"use server";
	const text = formData.get("text");
	if (typeof text !== "string" || !text) return;
	await addTodoAction(text);

	revalidateTag("todos");
}

async function toggleTodo(formData: FormData) {
	"use server";
	const id = formData.get("id");
	if (typeof id !== "string" || !id) return;
	await toggleTodoAction(Number.parseInt(id));

	revalidateTag("todos");
}

async function deleteTodo(formData: FormData) {
	"use server";
	const id = formData.get("id");
	if (typeof id !== "string" || !id) return;
	await deleteTodoAction(Number.parseInt(id));

	revalidateTag("todos");
}
