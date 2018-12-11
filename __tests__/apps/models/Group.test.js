import { models } from '../../../apps'
import * as db from '../../../db'

describe('apps.apis.models.Group', () => {
  beforeAll(() => {
    jest.setTimeout(10000)
    db.connect()
  })

  afterAll(() => {
    db.disconnect()
  })

  afterEach(async () => {
    await models.Group.deleteMany({ name: /^test-/ })
    await models.Permission.deleteMany({ resource: /^test-/ })
  })

  it('creates a new Group', async () => {
    const permissions = await models.Permission.create([
      { action: 'create:any', resource: 'test-res', attributes: ['*'] },
      { action: 'update:any', resource: 'test-res', attributes: ['*'] }
    ])
    const group = await models.Group.create({
      name: 'test-group',
      permissions: permissions.map(item => item._id)
    })
    expect(permissions.length).toBe(2)
    expect(typeof group._id).toBe('object')
    expect(typeof group.id).toBe('string')
    expect(group.id.length).toBe(24)
  })

  it('get AccessControl from group', async () => {
    // const permissions = await models.Permission.create([
    //   { action: 'create:any', resource: 'test-res', attributes: ['*'] },
    //   { action: 'update:any', resource: 'test-res', attributes: ['*'] }
    // ])
    // const group = await models.Group.create({
    //   name: 'test-group',
    //   permissions: permissions.map(item => item._id)
    // })
    // const acl = await group.access()
    // const canCreateAny = await group.can('createAny', 'test-res')
    // const canUpdateAny = await group.can('updateAny', 'test-res')
    // expect(acl).not.toBeFalsy()
    // expect(canCreateAny).toBeTruthy()
    // expect(canUpdateAny).toBeTruthy()
  })
})
