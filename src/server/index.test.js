import * as server from '../server'
import settings from '../settings'

describe('server', () => {
  it('server.start()', async () => {
    const instance = await server.start()
    expect(instance.info.port).toBe(settings.port)
  })

  it('server.compose()', async () => {
    const instance = await server.compose()
    const response = await instance.inject({
      url: '/notfound',
      method: 'GET',
      payload: { foo: 'bar' }
    })
    expect(response.statusCode).toBe(404)
  })
})
