import { fetchCompany } from '@/domain/company/api/fetch-company'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * 会社取得
 */
export const fetchCompanyHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const companyId = event.pathParameters?.id
  if (companyId == null) {
    throw new createHttpError.BadRequest()
  }

  const companyResponse = await fetchCompany(companyId)
  return formatJSONResponse({
    success: true,
    data: companyResponse,
  })
})
