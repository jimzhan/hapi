import * as db from '../db'

describe('db', () => {
  it('db.key()', () => {
    const key = db.Key()
    expect(key.length).toBe(24)
    expect(typeof key).toBe('string')
  })
})
