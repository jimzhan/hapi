import test from 'ava'
import { compose } from '../../server'

test('create a new user session', async t => {
  const server = await compose()
  let response = await server.inject({
    url: '/login',
    method: 'POST',
    payload: {
      username: 'sample@test.com',
      password: 'abcxyz'
    }
  })
  t.is(response.statusCode, 200)
})

test('remove an existing user session', async t => {
  const server = await compose()
  const response = await server.inject({
    url: '/logout',
    method: 'POST'
  })
  t.is(response.statusCode, 200)
})
