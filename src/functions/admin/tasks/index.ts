import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createTaskSchema, updateTaskSchema } from '@functions/admin/tasks/schema'

export const rules: AWS['functions'] = {
  fetchTaskListAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-task-list-admin-handler.fetchTaskListAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'admin/tasks',
          cors: corsSettings,
        },
      },
    ],
  },
  fetchTaskAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-task-admin-handler.fetchTaskAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'admin/tasks/{id}',
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
  createTaskAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/create-task-admin-handler.createTaskAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'post',
          path: 'admin/tasks',
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
    handler: `${handlerPath(__dirname)}/handlers/update-task-admin-handler.updateTaskAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'put',
          path: 'admin/tasks/{id}',
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
  deleteTaskAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/delete-task-admin-handler.deleteTaskAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'delete',
          path: 'admin/tasks/{id}',
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
