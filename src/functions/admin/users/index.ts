import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createAdminUserSchema } from './schema'

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
                schema: createAdminUserSchema,
              },
            },
          },
          cors: corsSettings,
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
}

export default rules
