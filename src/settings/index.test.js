import test from 'ava'
import settings from './index'

test('settings', t => {
  t.is(typeof settings.port, 'number')
})
