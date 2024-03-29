import { deleteCompany } from '@/domain/company/api/delete-api'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * 削除
 */
export const deleteCompanyAdminHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const companyId = event.pathParameters?.id
  if (companyId == null) {
    throw new createHttpError.BadRequest()
  }

  await deleteCompany(companyId)
  return formatJSONResponse({})
})
