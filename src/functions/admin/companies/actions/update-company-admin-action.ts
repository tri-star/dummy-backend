import { updateCompanySchema } from '@/domain/company/company'
import { updateCompany } from '@/domain/company/api/update-company'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { HTTPException } from 'hono/http-exception'

export class UpdateCompanyAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(app: OpenAPIHono): void {
    const route = createRoute({
      tags: ['companies'],
      method: 'put',
      path: ROUTES.ADMIN.COMPANIES.UPDATE.DEFINITION,
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
        },
      ],
      request: {
        body: {
          content: {
            'application/json': {
              schema: updateCompanySchema,
            },
          },
        },
      },
      responses: {
        204: {
          description: '',
        },
      },
    })

    app.openapi(route, async (c) => {
      const companyId = c.req.param('id')
      if (companyId == null) {
        throw new HTTPException(400, { message: 'idが指定されていません' })
      }

      const newData = c.req.valid('json')

      await updateCompany(companyId, newData)

      c.status(204)
      return c.body(null)
    })
  }
}
