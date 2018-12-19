import * as db from '../../../db'
import * as consts from '../../../apps/auth/consts'

const { actions } = consts

describe('apps.apis.models.Group', () => {
  let models

  beforeAll(() => {
    jest.setTimeout(10000)
    models = db.register()
    db.connect()
  })

  afterAll(() => {
    db.disconnect()
  })

  afterEach(async () => {
    await models.Group.deleteMany({ name: /^\w{24}$/ })
    await models.Permission.deleteMany({ resource: /^\w{24}$/ })
  })

  it('creates a new Group', async () => {
    const resource = db.Key()
    const permissions = await models.Permission.create([
      { action: actions.createAny, resource, attributes: ['*'] },
      { action: actions.updateAny, resource, attributes: ['*'] }
    ])
    const group = await models.Group.create({
      name: db.Key(),
      permissions: permissions.map(item => item._id)
    })
    expect(permissions.length).toBe(2)
    expect(typeof group._id).toBe('object')
    expect(typeof group.id).toBe('string')
    expect(group.id.length).toBe(24)
    expect(group.permissions.length).toBe(2)

    const access = await group.access()
    expect(access).toBeTruthy()

    const yes = await group.can(actions.createAny, resource)
    expect(yes).toBeTruthy()
  })

  it('get AccessControl from group', async () => {
    const resource = db.Key()
    const permissions = await models.Permission.create([
      { action: actions.createAny, resource, attributes: ['*'] },
      { action: actions.updateAny, resource, attributes: ['*'] }
    ])
    const group = await models.Group.create({
      name: db.Key(),
      permissions: permissions.map(item => item._id)
    })
    const acl = await group.access()
    const canCreateAny = await group.can(actions.createAny, resource)
    const canUpdateAny = await group.can(actions.updateAny, resource)
    expect(acl).not.toBeFalsy()
    expect(canCreateAny).toBeTruthy()
    expect(canUpdateAny).toBeTruthy()
  })
})
