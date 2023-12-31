import { dbCompanySchema, type Company, type UpdateCompany } from '@/domain/company/company'
import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import dayjs from 'dayjs'

export type CompanyListResponse = {
  data: Company[]
  count: number
}

/**
 * 会社一覧を取得する
 */
export async function fetchCompanies(): Promise<CompanyListResponse> {
  const segment = createSegment('Supabase')

  const companies = await traceAsync<Company[]>(segment, 'query', async () => {
    const dbCompanyList = await supabase.from('companies').select('*')

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

    return companies
  })

  return {
    data: companies,
    count: companies.length,
  }
}

/**
 * 会社の登録
 */
export async function createCompany(company: Company): Promise<Company> {
  const segment = createSegment('Supabase')

  const createdCompany = await traceAsync<Company>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabase.from('companies').insert({
      id: company.id,
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
      ...company,
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdCompany
}

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
