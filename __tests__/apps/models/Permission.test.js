import { consts, models } from '../../../apps'
import * as db from '../../../db'

const { actions } = consts

describe('apps.apis.models.Permission', () => {
  beforeAll(() => {
    jest.setTimeout(10000)
    db.connect()
  })

  afterAll(() => {
    db.disconnect()
  })

  afterEach(async () => {
    await models.Permission.deleteMany({ resource: /^test-/ })
  })

  it('creates a new Permission', async () => {
    const permission = await models.Permission.create({
      action: actions.createAny,
      resource: 'test-example',
      attributes: ['*']
    })
    expect(typeof permission._id).toBe('object')
    expect(typeof permission.id).toBe('string')
    expect(permission.id.length).toBe(24)
  })

  it('failed to create a duplicated Permission record', async () => {
    const permission = await models.Permission.create({
      action: actions.createAny,
      resource: 'test-example',
      attributes: ['*']
    })
    expect(permission.id.length).toBe(24)
    try {
      await models.Permission.create({
        action: actions.createAny,
        resource: 'test-example',
        attributes: ['*']
      })
    } catch (ex) {
      expect(ex).not.toBeFalsy()
    }
  })

  it('loads an existing Permission record via `loader`', async () => {
    const permission = await models.Permission.create({
      action: actions.createAny,
      resource: 'test-example',
      attributes: ['*']
    })
    const record = await models.Permission.load(permission.id)
    expect(record).toBeTruthy()
    expect(record.id).toBe(permission.id)
  })

  it('updates an existing Permission record', async () => {
    const permission = await models.Permission.create({
      action: actions.createAny,
      resource: 'test-example',
      attributes: ['*']
    })
    const record = await models.Permission.load(permission.id)
    record.action = actions.createOwn
    await record.save()
    expect(record.id).toBe(permission.id)
    expect(record.action).not.toBe(permission.action)
    expect(record.resource).toBe(permission.resource)
  })

  it('delete an existing Permission record', async () => {
    const { id } = await models.Permission.create({
      action: actions.createAny,
      resource: 'test-example',
      attributes: ['*']
    })
    await models.Permission.deleteOne({ _id: id })
    const record = await models.Permission.findById(id)
    expect(record).toBeFalsy()
  })
})
