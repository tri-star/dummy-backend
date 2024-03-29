import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { createUserSchema, updateUserSchema } from './schema'
import { corsSettings } from '@functions/cors'

export const rules: AWS['functions'] = {
  listUsersHandler: {
    handler: `${handlerPath(__dirname)}/handlers/list-users-handler.listUsersHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'users',
          request: {
            parameters: {
              querystrings: {
                loginId: true,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
  fetchUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-user-handler.fetchUserHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'users/{id}',
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
  createUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/create-user-handler.createUserHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'users',
          request: {
            schemas: {
              'application/json': {
                schema: createUserSchema,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
  updateUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/update-user-handler.updateUserHandler`,
    events: [
      {
        http: {
          method: 'put',
          path: 'users/{id}',
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
            schemas: {
              'application/json': {
                schema: updateUserSchema,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
  deleteUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/delete-user-handler.deleteUserHandler`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'users/{id}',
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
}

export default rules
