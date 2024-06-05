export const createUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    loginId: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['name', 'loginId', 'email'],
} as const

export const updateUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    loginId: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['name', 'loginId', 'email'],
} as const
