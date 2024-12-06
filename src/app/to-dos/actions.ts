'use server'

import { getDb } from "src/lib/db"

export type Todo = {
  id: number
  text: string
  completed: boolean
}

export async function getTodos(): Promise<Todo[]> {
  const db = getDb()
  const todos = db.query('SELECT id, text, completed != 0 as completed FROM todos ORDER BY id DESC').all() as Todo[]
  return todos
}

export async function addTodo(text: string) {
  const db = getDb()
  db.run('INSERT INTO todos (text, completed) VALUES (?, ?)', [text, 0])
  return getTodos()
}

export async function toggleTodo(id: number) {
  const db = getDb()
  db.run(
    'UPDATE todos SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END WHERE id = ?',
    [id]
  )
  return getTodos()
}

export async function deleteTodo(id: number) {
  const db = getDb()
  db.run('DELETE FROM todos WHERE id = ?', [id])
  return getTodos()
} 