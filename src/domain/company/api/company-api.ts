import { type UpdateCompany } from '@/domain/company/company'
import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

/**
 * 会社の更新
 */
export async function updateCompany(companyId: string, company: UpdateCompany): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'update', async () => {
    const result = await supabase
      .from('companies')
      .update({
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
        updated_at: new Date(),
      })
      .match({ id: companyId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}

/**
 * 会社の更新
 */
export async function deleteCompany(companyId: string): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'delete', async () => {
    const result = await supabase.from('companies').delete().match({ id: companyId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}
