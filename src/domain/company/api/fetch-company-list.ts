import { type Company, dbCompanySchema } from '@/domain/company/company'
import { supabaseClient } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import dayjs from 'dayjs'
import { type PostgrestFilterBuilder } from '@supabase/postgrest-js'

export type CompanyListResponse = {
  data: Company[]
  count: number
}

function buildSearchQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseQuery: PostgrestFilterBuilder<any, any, unknown[], 'companies', unknown>,
  name?: string,
) {
  if (name != null) {
    baseQuery = baseQuery.like('name', name)
  }
  return baseQuery
}

/**
 * 会社一覧を取得する
 */
export async function fetchCompanyList(name?: string): Promise<CompanyListResponse> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<CompanyListResponse>(segment, 'query', async () => {
    const dbCompanyListQuery = buildSearchQuery(supabaseClient().from('companies').select('*'), name)
    const dbCompanyCountQuery = buildSearchQuery(
      supabaseClient().from('companies').select('*', { count: 'exact', head: true }),
      name,
    )

    const dbCompanyList = await dbCompanyListQuery
    const countRecord = await dbCompanyCountQuery
    const count = countRecord.count ?? 0
    if (dbCompanyList.error != null) {
      throw new Error(JSON.stringify(dbCompanyList.error))
    }

    const companies: Company[] =
      dbCompanyList.data
        ?.map((dbCompanyJson) => {
          const parseResult = dbCompanySchema.safeParse(dbCompanyJson)
          if (!parseResult.success) {
            console.error(parseResult.error.errors)
            return undefined
          }
          return {
            id: parseResult.data.id,
            name: parseResult.data.name,
            postalCode: parseResult.data.postal_code,
            prefecture: parseResult.data.prefecture,
            address1: parseResult.data.address1,
            address2: parseResult.data.address2,
            address3: parseResult.data.address3,
            phone: parseResult.data.phone,
            canUseFeatureA: parseResult.data.can_use_feature_a,
            canUseFeatureB: parseResult.data.can_use_feature_b,
            canUseFeatureC: parseResult.data.can_use_feature_c,
            createdAt: dayjs(parseResult.data.created_at).toDate(),
            updatedAt: dayjs(parseResult.data.updated_at).toDate(),
          } as Company
        })
        .filter((company): company is Company => company !== undefined) ?? []

    return {
      data: companies,
      count,
    }
  })

  return result
}
