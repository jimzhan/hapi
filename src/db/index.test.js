import test from 'ava'
import * as db from './index'

test('db.Key()', async t => {
  const key = db.Key()
  t.is(key.length, 24)
  t.true(typeof key === 'string')
})
