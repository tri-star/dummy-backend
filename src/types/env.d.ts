declare namespace NodeJS {
  type ProcessEnv = {
    SUPABASE_URL: string
    SUPABASE_SERVICE_ROLE_KEY: string
    APP_KEY: string
    STAGE: string
  }
}
