import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createCompanySchema, updateCompanySchema } from '@functions/admin/companies/schema'

export const rules: AWS['functions'] = {
  listCompaniesAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-company-list-admin-handler.fetchCompanyListAdminHandler`,
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
  fetchCompanyAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-company-admin-handler.fetchCompanyAdminHandler`,
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
  createCompanyAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/create-company-admin-handler.createCompanyAdminHandler`,
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
  updateCompanyAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/update-company-admin-handler.updateCompanyAdminHandler`,
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
  deleteCompanyAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/delete-company-admin-handler.deleteCompanyAdminHandler`,
    events: [
      {
        http: {
          method: 'delete',
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
}

export default rules
