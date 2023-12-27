import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { createCompanySchema, updateCompanySchema } from '@functions/company/schema'

export const rules: AWS['functions'] = {
  listCompaniesHandler: {
    handler: `${handlerPath(__dirname)}/handler.listCompaniesHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'companies',
        },
      },
    ],
  },
  createCompanyHandler: {
    handler: `${handlerPath(__dirname)}/handler.createCompanyHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'companies',
          request: {
            schemas: {
              'application/json': {
                schema: createCompanySchema,
              },
            },
          },
        },
      },
    ],
  },
  updateCompanyHandler: {
    handler: `${handlerPath(__dirname)}/handler.updateCompanyHandler`,
    events: [
      {
        http: {
          method: 'patch',
          path: 'companies',
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
            schemas: {
              'application/json': {
                schema: updateCompanySchema,
              },
            },
          },
        },
      },
    ],
  },
  deleteCompanyHandler: {
    handler: `${handlerPath(__dirname)}/handler.deleteCompanyHandler`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'companies',
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
