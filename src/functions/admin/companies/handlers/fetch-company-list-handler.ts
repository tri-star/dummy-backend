import { fetchCompanyList } from '@/domain/company/api/fetch-company-list'
import { companySchema } from '@/domain/company/company'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'
import z from 'zod'

const listCompaniesRequestSchema = z.object({
  name: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listCompaniesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(companySchema),
  count: z.number(),
})
export type FetchCompanyListResponse = z.infer<typeof listCompaniesResponseSchema>

/**
 * 一覧
 */
export const fetchCompanyListHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const parsed = listCompaniesRequestSchema.safeParse(JSON.parse(event.body ?? '{}'))
  if (!parsed.success) {
    throw new createHttpError.BadRequest()
  }
  const { name /* page, offset */ } = parsed.data

  const companyListResponse = await fetchCompanyList(name)
  return formatJSONResponse({
    success: true,
    data: companyListResponse?.data ?? [],
    count: companyListResponse?.count ?? 0,
  } satisfies FetchCompanyListResponse)
})
