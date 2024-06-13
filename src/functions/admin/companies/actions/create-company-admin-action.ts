import { ulid } from 'ulid'
import { createCompanySchema } from '@/domain/company/company'
import { createCompany } from '@/domain/company/api/create-company'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { type AdminAppContext } from '@functions/admin-app'

export class CreateCompanyAdminAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      tags: ['companies'],
      method: 'post',
      path: ROUTES.ADMIN.COMPANIES.CREATE.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      request: {
        body: {
          content: {
            'application/json': {
              schema: createCompanySchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: createCompanySchema.extend({
                createdAt: z.string().optional(),
                updatedAt: z.string().optional(),
              }),
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const company = c.req.valid('json')

      const companyId = ulid()
      const createdCompany = await createCompany(companyId, company)
      return c.json(createdCompany)
    })
  }
}
