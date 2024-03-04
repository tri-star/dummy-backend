import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createCompanySchema } from '@functions/admin/companies/schema'

export const rules: AWS['functions'] = {
  // listCompaniesHandler: {
  //   handler: `${handlerPath(__dirname)}/handler.listCompaniesHandler`,
  //   events: [
  //     {
  //       http: {
  //         method: 'get',
  //         path: 'companies',
  //         cors: corsSettings,
  //       },
  //     },
  //   ],
  // },
  createCompanyHandler: {
    handler: `${handlerPath(__dirname)}/handlers/create-company-handler.createCompanyHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'companies',
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
  // updateCompanyHandler: {
  //   handler: `${handlerPath(__dirname)}/handler.updateCompanyHandler`,
  //   events: [
  //     {
  //       http: {
  //         method: 'patch',
  //         path: 'companies/{id}',
  //         cors: corsSettings,
  //         request: {
  //           parameters: {
  //             paths: {
  //               id: true,
  //             },
  //           },
  //           schemas: {
  //             'application/json': {
  //               schema: updateCompanySchema,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
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
