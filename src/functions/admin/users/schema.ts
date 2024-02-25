export const createAdminUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    loginId: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['name', 'loginId', 'password'],
} as const

export const updateAdminUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    loginId: { type: 'string' },
  },
  required: ['name', 'loginId'],
} as const
