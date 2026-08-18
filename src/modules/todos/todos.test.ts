import { describe, it, expect, beforeEach } from 'vitest';
import { TodosRepository } from './todos.repository.js';
import { TodosService } from './todos.service.js';
import { NotFoundError } from '../../shared/errors/app-error.js';

describe('TodosService', () => {
  let repository: TodosRepository;
  let service: TodosService;

  beforeEach(() => {
    repository = new TodosRepository();
    service = new TodosService(repository);
  });

  it('should create a new todo', async () => {
    const todo = await service.createTodo({
      title: 'Test Todo',
      description: 'Test Description',
    });

    expect(todo).toHaveProperty('id');
    expect(todo.title).toBe('Test Todo');
    expect(todo.description).toBe('Test Description');
    expect(todo.completed).toBe(false);
  });

  it('should retrieve all todos', async () => {
    await service.createTodo({ title: 'Todo 1' });
    await service.createTodo({ title: 'Todo 2' });

    const todos = await service.getAllTodos();
    expect(todos).toHaveLength(2);
  });

  it('should throw NotFoundError when fetching non-existent todo', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    await expect(service.getTodoById(nonExistentId)).rejects.toThrow(NotFoundError);
  });

  it('should update an existing todo', async () => {
    const created = await service.createTodo({ title: 'Initial Title' });
    const updated = await service.updateTodo(created.id, { completed: true });

    expect(updated.completed).toBe(true);
    expect(updated.title).toBe('Initial Title');
  });

  it('should delete a todo', async () => {
    const created = await service.createTodo({ title: 'To Delete' });
    await service.deleteTodo(created.id);

    await expect(service.getTodoById(created.id)).rejects.toThrow(NotFoundError);
  });
});
