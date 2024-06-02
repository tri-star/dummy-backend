export const ROUTES = {
  ADMIN: {
    AUTH: {
      LOGIN: {
        DEFINITION: '/admin/auth/login',
      },
    },
    ADMIN_USERS: {
      CREATE: {
        DEFINITION: '/admin/admin-users',
      },
      LIST: {
        DEFINITION: '/admin/admin-users',
      },
      DETAIL: {
        DEFINITION: '/admin/admin-users/{id}',
        URL: (id: string) => `/admin/admin-users/${id}`,
      },
    },
  },
} as const
