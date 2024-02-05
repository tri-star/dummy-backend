import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'

export const rules: AWS['functions'] = {
  createAdminUserNoAuthHandler: {
    handler: `${handlerPath(__dirname)}/handler.createAdminUserNoAuthHandler`,
    events: [
      {
        sns: 'createAdminUser',
      },
    ],
  },
}

export default rules
