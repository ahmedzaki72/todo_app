import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  completed: z.boolean().optional(),
});

export const todoParamsSchema = z.object({
  id: z.string().uuid('Invalid Todo ID format'),
});

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
