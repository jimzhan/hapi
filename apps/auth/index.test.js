import { start } from '../../server'

describe('server', () => {
  let server

  beforeEach(async () => {
    server = await start()
  })

  afterEach(async () => {
    await server.stop()
    server = null
  })

  it('create a new user session', async () => {
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

  it('remove an existing user session', async () => {
    const response = await server.inject({
      url: '/logout',
      method: 'POST'
    })
    expect(response.statusCode).toBe(200)
  })
})
