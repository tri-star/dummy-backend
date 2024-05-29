import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createAdminUserJsonSchema } from './schema'

export const rules: AWS['functions'] = {
  createAdminUserNoAuthHandler: {
    handler: `${handlerPath(__dirname)}/handlers/create-admin-user-no-auth-handler.createAdminUserNoAuthHandler`,
    events: [
      {
        sns: 'createAdminUser',
      },
    ],
  },
  createAdminUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/create-admin-user-handler.createAdminUserHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'admin/users',
          request: {
            schemas: {
              'application/json': {
                schema: createAdminUserJsonSchema,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
  fetchAdminUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-admin-user-handler.fetchAdminUserHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'admin/users/{id}',
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
  listAdminUsersHandler: {
    handler: `${handlerPath(__dirname)}/handlers/list-admin-users-handler.listAdminUsersHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'admin/users',
          // request: {
          //   parameters: {
          //     querystrings: {
          //       loginId: true,
          //     },
          //   },
          // },
          cors: corsSettings,
        },
      },
    ],
  },
  updateAdminUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/update-admin-user-handler.updateAdminUserHandler`,
    events: [
      {
        http: {
          method: 'put',
          path: 'admin/users/{id}',
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
            // schemas: {
            //   'application/json': {
            //     schema: updateAdminUserJsonSchema,
            //   },
            // },
          },
          cors: corsSettings,
        },
      },
    ],
  },
  deleteAdminUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/delete-admin-user-handler.deleteAdminUserHandler`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'admin/users/{id}',
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
