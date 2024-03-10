import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createTaskSchema } from '@functions/admin/tasks/schema'

export const rules: AWS['functions'] = {
  listTasksHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-task-list-admin-handler.fetchTaskListAdminHandler`,
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
  // updateTaskHandler: {
  //   handler: `${handlerPath(__dirname)}/handler.updateTaskHandler`,
  //   events: [
  //     {
  //       http: {
  //         method: 'patch',
  //         path: 'tasks/{id}',
  //         cors: corsSettings,
  //         request: {
  //           parameters: {
  //             paths: {
  //               id: true,
  //             },
  //           },
  //           schemas: {
  //             'application/json': {
  //               schema: updateTaskSchema,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
  // deleteTaskHandler: {
  //   handler: `${handlerPath(__dirname)}/handler.deleteTaskHandler`,
  //   events: [
  //     {
  //       http: {
  //         method: 'delete',
  //         path: 'tasks/{id}',
  //         cors: corsSettings,
  //         request: {
  //           parameters: {
  //             paths: {
  //               id: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
}

export default rules
