import settings from '../settings'

describe('settings', () => {
  it('gets default port', () => {
    expect(typeof settings.port).toBe('number')
  })
})
