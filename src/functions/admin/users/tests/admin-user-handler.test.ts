import { supabase } from '@libs/supabase/api-client'
import { createAdminUserNoAuthHandler } from '../handler'

describe('admin-user-handler', () => {
  beforeEach(async () => {
    await supabase.from('admin_users').delete()
  })

  test('登録処理が成功すること', async () => {
    const result = await createAdminUserNoAuthHandler({
      name: 'test',
      email: '',
      loginId: 'test',
      password: 'testtest',
    })
    expect(result.statusCode).toBe(200)
  })
})
