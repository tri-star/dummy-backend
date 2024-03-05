import { createCompany } from '@/domain/company/api/create-company'
import { ulid } from 'ulid'

export async function prepareCompany(attributes: { id?: string; name?: string }) {
  attributes.id ??= ulid()
  attributes.name ??= ulid()
  return await createCompany(attributes.id, {
    name: attributes.name,
    postalCode: '123-4567',
    prefecture: '東京都',
    address1: '渋谷区',
    address2: '1-2-3',
    address3: 'アパート',
    phone: '090-1234-5678',
    canUseFeatureA: true,
    canUseFeatureB: false,
    canUseFeatureC: true,
  })
}

export async function prepareCompanies(attributes: { name?: string }, count: number) {
  const baseName = attributes.name ?? ulid()
  for (let i = 1; i <= count; i++) {
    const id = ulid()
    const name = `${baseName}${i}`
    await prepareCompany({
      id,
      name,
    })
  }
}
