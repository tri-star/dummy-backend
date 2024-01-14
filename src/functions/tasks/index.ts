import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { createTaskSchema, updateTaskSchema } from '@functions/tasks/schema'
import { corsSettings } from '@functions/cors'

export const rules: AWS['functions'] = {
  listTasksHandler: {
    handler: `${handlerPath(__dirname)}/handler.listTasksHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'tasks',
          cors: corsSettings,
        },
      },
    ],
  },
  createTaskHandler: {
    handler: `${handlerPath(__dirname)}/handler.createTaskHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'tasks',
          cors: corsSettings,
          request: {
            schemas: {
              'application/json': {
                schema: createTaskSchema,
              },
            },
          },
        },
      },
    ],
  },
  updateTaskHandler: {
    handler: `${handlerPath(__dirname)}/handler.updateTaskHandler`,
    events: [
      {
        http: {
          method: 'patch',
          path: 'tasks/{id}',
          cors: corsSettings,
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
            schemas: {
              'application/json': {
                schema: updateTaskSchema,
              },
            },
          },
        },
      },
    ],
  },
  deleteTaskHandler: {
    handler: `${handlerPath(__dirname)}/handler.deleteTaskHandler`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'tasks/{id}',
          cors: corsSettings,
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
          },
        },
      },
    ],
  },
}

export default rules
