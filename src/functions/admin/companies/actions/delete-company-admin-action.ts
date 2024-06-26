import { deleteCompany } from '@/domain/company/api/delete-api'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { HTTPException } from 'hono/http-exception'
import { type AdminAppContext } from '@functions/admin-app'

export class DeleteCompanyAdminAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      tags: ['companies'],
      method: 'delete',
      path: ROUTES.ADMIN.COMPANIES.DELETE.DEFINITION,
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

      await deleteCompany(companyId)
      c.status(204)
      return c.body(null)
    })
  }
}
