import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createCompanySchema, updateCompanySchema } from '@functions/admin/companies/schema'

export const rules: AWS['functions'] = {
  listCompaniesHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-company-list-handler.fetchCompanyListHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'admin/companies',
          cors: corsSettings,
        },
      },
    ],
  },
  fetchCompanyHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-company-handler.fetchCompanyHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'admin/companies/{id}',
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
  createCompanyHandler: {
    handler: `${handlerPath(__dirname)}/handlers/create-company-handler.createCompanyHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'admin/companies',
          cors: corsSettings,
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
    handler: `${handlerPath(__dirname)}/handlers/update-company-handler.updateCompanyHandler`,
    events: [
      {
        http: {
          method: 'put',
          path: 'admin/companies/{id}',
          cors: corsSettings,
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
  // deleteCompanyHandler: {
  //   handler: `${handlerPath(__dirname)}/handler.deleteCompanyHandler`,
  //   events: [
  //     {
  //       http: {
  //         method: 'delete',
  //         path: 'companies/{id}',
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
