import { createCompany, fetchCompanies, updateCompany } from '@/domain/company/apy/company-api'
import { companySchema, updateCompanySchema } from '@/domain/company/company'
import { deleteUser } from '@/domain/users/api/user-api'
import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
// import { companySchema } from 'src/domain/company/company'

/**
 * 一覧
 */
export const listCompaniesHandler = middyfy(async () => {
  try {
    const companies = await fetchCompanies()
    return formatJSONResponse({
      data: companies.data,
      count: companies.count,
    })
  } catch (e) {
    return formatJSONUserErrorResponse({ error: e })
  }
})

export const createCompanyHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const parseResult = companySchema.safeParse(event.body)
  if (!parseResult.success) {
    console.error('createCompanyHandler error', parseResult.error.errors)
    formatJSONUserErrorResponse({ errors: parseResult.error.errors })
    return
  }

  const company = parseResult.data

  await createCompany({
    id: company.id,
    name: company.name,
    postalCode: company.postalCode,
    prefecture: company.prefecture,
    address1: company.address1,
    address2: company.address2,
    address3: company.address3,
    phone: company.phone,
    canUseFeatureA: company.canUseFeatureA,
    canUseFeatureB: company.canUseFeatureB,
    canUseFeatureC: company.canUseFeatureC,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return formatJSONResponse({})
})

export const updateCompanyHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const companyId = event.pathParameters?.id
  if (companyId == null) {
    return formatJSONUserErrorResponse({ error: new Error('companyId is required') })
  }

  const parseResult = updateCompanySchema.safeParse(event.body)
  if (!parseResult.success) {
    console.error('updateCompanyHandler error', parseResult.error.errors)
    formatJSONUserErrorResponse({ errors: parseResult.error.errors })
    return
  }

  const company = parseResult.data

  await updateCompany(companyId, {
    name: company.name,
    postalCode: company.postalCode,
    prefecture: company.prefecture,
    address1: company.address1,
    address2: company.address2,
    address3: company.address3,
    phone: company.phone,
    canUseFeatureA: company.canUseFeatureA,
    canUseFeatureB: company.canUseFeatureB,
    canUseFeatureC: company.canUseFeatureC,
  })

  return formatJSONResponse({})
})

export const deleteCompanyHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const companyId = event.pathParameters?.id
  if (companyId == null) {
    return formatJSONUserErrorResponse({ error: new Error('companyId is required') })
  }

  await deleteUser(companyId)

  return formatJSONResponse({})
})
