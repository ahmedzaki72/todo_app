import { ITodosRepository } from './todos.repository.js';
import { Todo, CreateTodoDto, UpdateTodoDto } from './todos.schema.js';
import { NotFoundError } from '../../shared/errors/app-error.js';

export class TodosService {
  constructor(private readonly todosRepository: ITodosRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.todosRepository.findAll();
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findById(id);
    if (!todo) {
      throw new NotFoundError(`Todo with ID '${id}' not found`);
    }
    return todo;
  }

  async createTodo(dto: CreateTodoDto): Promise<Todo> {
    return this.todosRepository.create(dto);
  }

  async updateTodo(id: string, dto: UpdateTodoDto): Promise<Todo> {
    await this.getTodoById(id); // Throws NotFoundError if missing
    const updated = await this.todosRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundError(`Todo with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteTodo(id: string): Promise<void> {
    await this.getTodoById(id);
    await this.todosRepository.delete(id);
  }
}
