import test from 'ava'
import * as server from '../server'
import settings from '../settings'

test('start an hapi server', async t => {
  const instance = await server.start()
  t.is(instance.info.port, settings.port)
  await instance.stop()
})

test('access a non-existent url', async t => {
  const instance = await server.compose()
  const response = await instance.inject({
    url: '/notfound',
    method: 'GET',
    payload: { foo: 'bar' }
  })
  t.is(response.statusCode, 404)
})
