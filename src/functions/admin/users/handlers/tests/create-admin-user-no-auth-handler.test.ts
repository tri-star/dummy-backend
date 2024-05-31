import { supabaseClient } from '@libs/supabase/api-client'
import { createAdminUserNoAuthHandler } from '@/functions/admin/users/handlers/create-admin-user-no-auth-handler'

describe('createAdminUserNoAuthHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const result = await createAdminUserNoAuthHandler({
      name: 'test',
      loginId: 'test',
      password: 'testtest',
    })
    expect(result.statusCode).toBe(200)
  })
})
