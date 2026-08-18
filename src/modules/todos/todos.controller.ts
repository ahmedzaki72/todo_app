import { Request, Response, NextFunction } from 'express';
import { TodosService } from './todos.service.js';
import { sendSuccess } from '../../shared/utils/response.util.js';
import { CreateTodoDto, UpdateTodoDto } from './todos.schema.js';

export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todos = await this.todosService.getAllTodos();
      sendSuccess(res, todos, 'Todos retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todo = await this.todosService.getTodoById(req.params.id);
      sendSuccess(res, todo, 'Todo retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateTodoDto = req.body;
      const todo = await this.todosService.createTodo(dto);
      sendSuccess(res, todo, 'Todo created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: UpdateTodoDto = req.body;
      const todo = await this.todosService.updateTodo(req.params.id, dto);
      sendSuccess(res, todo, 'Todo updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.todosService.deleteTodo(req.params.id);
      sendSuccess(res, null, 'Todo deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
