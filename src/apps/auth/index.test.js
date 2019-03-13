import { compose } from '../../server'

describe('apps.auth', () => {
  it('POST /login', async () => {
    const server = await compose()
    let response = await server.inject({
      url: '/login',
      method: 'POST',
      payload: {
        username: 'sample@test.com',
        password: 'abcxyz'
      }
    })
    expect(response.statusCode).toBe(200)
  })

  it('POST /logout', async () => {
    const server = await compose()
    const response = await server.inject({
      url: '/logout',
      method: 'POST'
    })
    expect(response.statusCode).toBe(200)
  })
})
