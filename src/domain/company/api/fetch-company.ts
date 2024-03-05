import { createSegment, traceAsync } from '@libs/xray-tracer'
import { supabase } from '@libs/supabase/api-client'
import { dbCompanySchema, type Company } from '@/domain/company/company'

/**
 * 会社を取得する
 */
export async function fetchCompany(companyId: string): Promise<Company | undefined> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<Company | undefined>(segment, 'query', async () => {
    const dbResult = await supabase.from('companies').select('*').eq('id', companyId)

    if (dbResult.error != null) {
      throw new Error(JSON.stringify(dbResult.error))
    }

    const parsedCompany = dbCompanySchema.safeParse(dbResult.data[0] as Record<string, unknown>)
    if (!parsedCompany.success) {
      console.error('会社情報のパースに失敗しました', dbResult, parsedCompany.error)
      return undefined
    }

    return {
      id: parsedCompany.data.id,
      name: parsedCompany.data.name,
      postalCode: parsedCompany.data.postal_code,
      prefecture: parsedCompany.data.prefecture,
      address1: parsedCompany.data.address1,
      address2: parsedCompany.data.address2,
      address3: parsedCompany.data.address3,
      phone: parsedCompany.data.phone,
      canUseFeatureA: parsedCompany.data.can_use_feature_a,
      canUseFeatureB: parsedCompany.data.can_use_feature_b,
      canUseFeatureC: parsedCompany.data.can_use_feature_c,
      createdAt: new Date(parsedCompany.data.created_at),
      updatedAt: new Date(parsedCompany.data.updated_at),
    } satisfies Company
  })

  return result
}
