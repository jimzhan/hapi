import settings from '../settings'

describe('settings', () => {
  it('settings', () => {
    expect(typeof settings.port).toBe('number')
  })
})
