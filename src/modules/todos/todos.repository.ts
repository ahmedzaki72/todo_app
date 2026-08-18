import { randomUUID } from 'crypto';
import { Todo, CreateTodoDto, UpdateTodoDto } from './todos.schema.js';

export interface ITodosRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(data: CreateTodoDto): Promise<Todo>;
  update(id: string, data: UpdateTodoDto): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}

export class TodosRepository implements ITodosRepository {
  private todos: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null;
  }

  async create(data: CreateTodoDto): Promise<Todo> {
    const now = new Date();
    const todo: Todo = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  async update(id: string, data: UpdateTodoDto): Promise<Todo | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: Todo = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.todos.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }
}
