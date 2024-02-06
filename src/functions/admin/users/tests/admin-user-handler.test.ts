import { createAdminUserNoAuthHandler } from '../handler'

describe('admin-user-handler', () => {
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
