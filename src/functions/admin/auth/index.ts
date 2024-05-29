import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { adminLoginSchema } from './schema'

export const rules: AWS['functions'] = {
  adminLoginHandler: {
    handler: `${handlerPath(__dirname)}/handler.adminLoginHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'post',
          path: 'admin/auth/login',
          request: {
            schemas: {
              'application/json': {
                schema: adminLoginSchema,
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
