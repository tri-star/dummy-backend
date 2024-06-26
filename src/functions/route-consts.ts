export const ROUTES = {
  ADMIN: {
    AUTH: {
      LOGIN: {
        DEFINITION: '/admin/auth/login',
      },
      VALIDATE_LOGIN_ID: {
        DEFINITION: '/admin/auth/validate-login-id',
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
      SELF: {
        DEFINITION: '/admin/admin-users/self',
      },
      UPDATE: {
        DEFINITION: '/admin/admin-users/{id}',
        URL: (id: string) => `/admin/admin-users/${id}`,
      },
      DELETE: {
        DEFINITION: '/admin/admin-users/{id}',
        URL: (id: string) => `/admin/admin-users/${id}`,
      },
    },
    COMPANIES: {
      CREATE: {
        DEFINITION: '/admin/companies',
      },
      LIST: {
        DEFINITION: '/admin/companies',
      },
      DETAIL: {
        DEFINITION: '/admin/companies/{id}',
        URL: (id: string) => `/admin/companies/${id}`,
      },
      UPDATE: {
        DEFINITION: '/admin/companies/{id}',
        URL: (id: string) => `/admin/companies/${id}`,
      },
      DELETE: {
        DEFINITION: '/admin/companies/{id}',
        URL: (id: string) => `/admin/companies/${id}`,
      },
    },
    USERS: {
      CREATE: {
        DEFINITION: '/admin/users',
      },
      LIST: {
        DEFINITION: '/admin/users',
      },
      DETAIL: {
        DEFINITION: '/admin/users/{id}',
        URL: (id: string) => `/admin/users/${id}`,
      },
      UPDATE: {
        DEFINITION: '/admin/users/{id}',
        URL: (id: string) => `/admin/users/${id}`,
      },
      DELETE: {
        DEFINITION: '/admin/users/{id}',
        URL: (id: string) => `/admin/users/${id}`,
      },
    },
    TASKS: {
      CREATE: {
        DEFINITION: '/admin/tasks',
      },
      LIST: {
        DEFINITION: '/admin/tasks',
      },
      DETAIL: {
        DEFINITION: '/admin/tasks/{id}',
        URL: (id: string) => `/admin/tasks/${id}`,
      },
      UPDATE: {
        DEFINITION: '/admin/tasks/{id}',
        URL: (id: string) => `/admin/tasks/${id}`,
      },
      DELETE: {
        DEFINITION: '/admin/tasks/{id}',
        URL: (id: string) => `/admin/tasks/${id}`,
      },
    },
  },
  AUTH: {
    LOGIN: {
      DEFINITION: '/auth/login',
    },
  },
  USERS: {
    CREATE: {
      DEFINITION: '/users',
    },
    LIST: {
      DEFINITION: '/users',
    },
    DETAIL: {
      DEFINITION: '/users/{id}',
      URL: (id: string) => `/users/${id}`,
    },
    UPDATE: {
      DEFINITION: '/users/{id}',
      URL: (id: string) => `/users/${id}`,
    },
    DELETE: {
      DEFINITION: '/users/{id}',
      URL: (id: string) => `/users/${id}`,
    },
  },
} as const
