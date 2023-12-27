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

export const createCompanySchema = companySchema.omit({ id: true, createdAt: true, updatedAt: true })
export type CreateCompany = z.infer<typeof createCompanySchema>

export const updateCompanySchema = companySchema.omit({ id: true, createdAt: true, updatedAt: true })
export type UpdateCompany = z.infer<typeof updateCompanySchema>

export type Company = z.infer<typeof companySchema>

export const dbCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  postal_code: z.string(),
  prefecture: z.string(),
  address1: z.string(), // 市区町村
  address2: z.string(), // 番地
  address3: z.string().optional(), // アパート
  phone: z.string(),
  can_use_feature_a: z.boolean().default(false),
  can_use_feature_b: z.boolean().default(false),
  can_use_feature_c: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
})
