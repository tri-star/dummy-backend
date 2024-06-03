import { fetchCompanyList } from '@/domain/company/api/fetch-company-list'
import { companySchema } from '@/domain/company/company'
import { ROUTES } from '@functions/route-consts'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'

const listCompaniesRequestSchema = z.object({
  name: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listCompaniesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(
    companySchema.extend({
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
    }),
  ),
  count: z.number(),
})
export type FetchCompanyListResponse = z.infer<typeof listCompaniesResponseSchema>

export class ListCompanyAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(app: OpenAPIHono): void {
    const route = createRoute({
      tags: ['companies'],
      method: 'get',
      path: ROUTES.ADMIN.COMPANIES.LIST.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      request: {
        query: listCompaniesRequestSchema,
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: listCompaniesResponseSchema,
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const { name /* page, offset */ } = c.req.valid('query')

      const companyListResponse = await fetchCompanyList(name)
      return c.json({
        success: true,
        data:
          companyListResponse?.data?.map((company) => ({
            ...company,
            createdAt: company.createdAt?.toISOString(),
            updatedAt: company.updatedAt?.toISOString(),
          })) ?? [],
        count: companyListResponse?.count ?? 0,
      } satisfies FetchCompanyListResponse)
    })
  }
}
