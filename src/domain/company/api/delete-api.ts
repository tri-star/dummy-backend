import { supabaseClient } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

/**
 * 会社の更新
 */
export async function deleteCompany(companyId: string): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'delete', async () => {
    const result = await supabaseClient().from('companies').delete().match({ id: companyId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}
