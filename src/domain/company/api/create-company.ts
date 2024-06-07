import { type Company, type CreateCompany } from '@/domain/company/company'
import { supabaseClient } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

/**
 * 会社の登録
 */
export async function createCompany(companyId: string, company: CreateCompany): Promise<Company> {
  const segment = createSegment('Supabase')

  const createdCompany = await traceAsync<Company>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabaseClient().from('companies').insert({
      id: companyId,
      name: company.name,
      postal_code: company.postalCode,
      prefecture: company.prefecture,
      address1: company.address1,
      address2: company.address2,
      address3: company.address3,
      phone: company.phone,
      can_use_feature_a: company.canUseFeatureA,
      can_use_feature_b: company.canUseFeatureB,
      can_use_feature_c: company.canUseFeatureC,
      created_at: now,
      updated_at: now,
    })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
    return {
      id: companyId,
      ...company,
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdCompany
}
