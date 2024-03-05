import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'
import { updateCompanySchema } from '@/domain/company/company'
import { updateCompany } from '@/domain/company/api/company-api'

/**
 * 編集
 */
export const updateCompanyHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const companyId = event.pathParameters?.id
  const parseResult = updateCompanySchema.safeParse(event.body ?? '{}')
  if (companyId == null) {
    throw new createHttpError.BadRequest('idが指定されていません')
  }
  if (!parseResult.success) {
    console.error(parseResult.error.errors)
    throw new createHttpError.BadRequest()
  }

  const newData = parseResult.data

  await updateCompany(companyId, newData)
  return formatJSONResponse({})
})
