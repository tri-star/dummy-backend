import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'

export const rules: AWS['functions'] = {
  createAdminUserNoAuthHandler: {
    handler: `${handlerPath(__dirname)}/handler.createAdminUserNoAuthHandler`,
    events: [
      {
        sns: 'createAdminUser',
      },
    ],
  },
  listAdminUsersHandler: {
    handler: `${handlerPath(__dirname)}/handler.listAdminUsersHandler`,
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
