import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient>

export function supabaseClient() {
  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '')
  }
  return supabase
}

// export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
//   auth: {
//     persistSession: false,
//     autoRefreshToken: false,
//     detectSessionInUrl: false,
//   },
// })
