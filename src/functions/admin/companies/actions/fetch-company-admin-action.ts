import { fetchCompany } from '@/domain/company/api/fetch-company'
import { companySchema } from '@/domain/company/company'
import { ROUTES } from '@functions/route-consts'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class FetchCompanyAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(app: OpenAPIHono): void {
    const route = createRoute({
      tags: ['companies'],
      method: 'get',
      path: ROUTES.ADMIN.COMPANIES.DETAIL.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ULID',
        },
      ],
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: companySchema.extend({
                createdAt: z.string().optional(),
                updatedAt: z.string().optional(),
              }),
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const companyId = c.req.param('id')
      if (companyId == null) {
        throw new HTTPException(400)
      }

      const companyResponse = await fetchCompany(companyId)

      if (companyResponse == null) {
        throw new HTTPException(404)
      }

      return c.json({
        ...companyResponse,
      })
    })
  }
}
