import { env } from './env.js';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Enterprise TodoApp API',
    version: '1.0.0',
    description: 'Interactive OpenAPI/Swagger documentation for Enterprise Express + TypeScript Base Architecture',
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api/v1`,
      description: 'Local Development Server',
    },
  ],
  components: {
    schemas: {
      ApiResponseSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              traceId: { type: 'string', example: 'd6e10ab8-4fc0-4eee-a03c-83352b66f97e' },
              timestamp: { type: 'string', example: '2026-08-18T03:30:00.000Z' },
            },
          },
        },
      },
      ApiResponseError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'BAD_REQUEST' },
              message: { type: 'string', example: 'Validation failed' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
          meta: {
            type: 'object',
            properties: {
              traceId: { type: 'string', example: 'b7ac64f7-def6-49fc-85e3-7293497d3c0e' },
              timestamp: { type: 'string', example: '2026-08-18T03:30:00.000Z' },
            },
          },
        },
      },
      Todo: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'e984540b-4f70-4038-b2ac-9bbbe7fabc11' },
          title: { type: 'string', example: 'تعلم بناء المعماريات المتقدمة' },
          description: { type: 'string', example: 'استخدام Express و TypeScript و Zod' },
          completed: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTodoInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'تعلم بناء المعماريات المتقدمة' },
          description: { type: 'string', example: 'استخدام Express و TypeScript و Zod' },
        },
      },
      UpdateTodoInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'عنوان جديد' },
          description: { type: 'string', example: 'وصف جديد' },
          completed: { type: 'boolean', example: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Check service health status',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' },
              },
            },
          },
        },
      },
    },
    '/todos': {
      get: {
        summary: 'Get all todos',
        tags: ['Todos'],
        responses: {
          '200': {
            description: 'List of all todos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new todo',
        tags: ['Todos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTodoInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Todo created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' },
              },
            },
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseError' },
              },
            },
          },
        },
      },
    },
    '/todos/{id}': {
      get: {
        summary: 'Get todo by ID',
        tags: ['Todos'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Todo details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' },
              },
            },
          },
          '404': {
            description: 'Todo not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseError' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update todo by ID',
        tags: ['Todos'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTodoInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Todo updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' },
              },
            },
          },
          '404': {
            description: 'Todo not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseError' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete todo by ID',
        tags: ['Todos'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Todo deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' },
              },
            },
          },
          '404': {
            description: 'Todo not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseError' },
              },
            },
          },
        },
      },
    },
  },
};
