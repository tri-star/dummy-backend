import z from 'zod'

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  postalCode: z.string(),
  prefecture: z.string(),
  address1: z.string(), // 市区町村
  address2: z.string(), // 番地
  address3: z.string().optional(), // アパート
  phone: z.string(),
  canUseFeatureA: z.boolean().default(false),
  canUseFeatureB: z.boolean().default(false),
  canUseFeatureC: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const updateCompanySchema = companySchema.omit({ id: true, createdAt: true, updatedAt: true })
export type UpdateCompany = z.infer<typeof updateCompanySchema>

export type Company = z.infer<typeof companySchema>

export const dbCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  postalCode: z.string(),
  prefecture: z.string(),
  address1: z.string(), // 市区町村
  address2: z.string(), // 番地
  address3: z.string().optional(), // アパート
  phone: z.string(),
  canUseFeatureA: z.boolean().default(false),
  canUseFeatureB: z.boolean().default(false),
  canUseFeatureC: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
})
