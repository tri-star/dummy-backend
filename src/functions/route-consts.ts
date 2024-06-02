export const ROUTES = {
  ADMIN: {
    ADMIN_USERS: {
      CREATE: {
        DEFINITION: '/admin/admin-users',
      },
      LIST: {
        DEFINITION: '/admin/admin-users',
      },
      DETAIL: {
        DEFINITION: '/admin/admin-users/:id',
        url: (id: string) => `/admin/admin-users/${id}`,
      },
    },
  },
} as const
