import z, { number } from 'zod'

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  postalCode: number(),
  prefecture: z.string(),
  address1: z.string(), // 市区町村
  address2: z.string(), // 番地
  address3: z.string().optional(), // アパート
  phone: z.string(),
  canUseFeatureA: z.boolean().default(false),
  canUseFeatureB: z.boolean().default(false),
  canUseFeatureC: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Company = z.infer<typeof companySchema>
