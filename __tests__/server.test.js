import { start } from '../server'
import settings from '../settings'

describe('server', () => {
  let server

  beforeAll(async () => {
    server = await start()
  })

  afterAll(async () => {
    await server.stop()
  })

  it('start an hapi server', async () => {
    expect(server.info.port).toBe(settings.port)
  })

  it('access a non-existent url', async () => {
    const response = await server.inject({
      url: '/notfound',
      method: 'GET',
      payload: { foo: 'bar' }
    })
    expect(response.statusCode).toBe(404)
  })
})
