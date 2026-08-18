import { Router } from 'express';
import { TodosRepository } from './todos.repository.js';
import { TodosService } from './todos.service.js';
import { TodosController } from './todos.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { createTodoSchema, updateTodoSchema, todoParamsSchema } from './todos.schema.js';

const router = Router();

// Instantiate dependencies
const todosRepository = new TodosRepository();
const todosService = new TodosService(todosRepository);
const todosController = new TodosController(todosService);

router.get('/', todosController.getAll);

router.get('/:id', validate({ params: todoParamsSchema }), todosController.getById);

router.post('/', validate({ body: createTodoSchema }), todosController.create);

router.patch(
  '/:id',
  validate({ params: todoParamsSchema, body: updateTodoSchema }),
  todosController.update
);

router.delete('/:id', validate({ params: todoParamsSchema }), todosController.delete);

export const todosRoutes = router;
