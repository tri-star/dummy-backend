export const adminLoginSchema = {
  type: 'object',
  properties: {
    loginId: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['loginId', 'password'],
} as const
