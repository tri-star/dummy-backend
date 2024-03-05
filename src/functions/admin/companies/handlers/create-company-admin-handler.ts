import { formatJSONResponse } from '@libs/api-gateway'
import { ulid } from 'ulid'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'
import { createCompanySchema } from '@/domain/company/company'
import { createCompany } from '@/domain/company/api/create-company'

/**
 * 登録
 */
export const createCompanyAdminHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const parseResult = createCompanySchema.safeParse(event.body ?? '{}')
  if (!parseResult.success) {
    throw new createHttpError.BadRequest()
  }

  const company = parseResult.data

  const companyId = ulid()
  const createdCompany = await createCompany(companyId, company)
  return formatJSONResponse({ data: createdCompany })
})
