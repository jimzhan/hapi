import mongoose from 'mongoose'
import * as db from '../../../db'
import * as consts from '../../../apps/auth/consts'

const { actions } = consts

describe('apps.apis.Permission', () => {
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

  it('upsert many permissions', async () => {
    const permission = await models.Permission.create({
      action: actions.createAny,
      resource: 'test-x',
      attributes: ['*']
    })

    const newId = mongoose.Types.ObjectId()
    const { insertedCount, modifiedCount } = await models.Permission.bulkWrite([
      {
        insertOne: {
          document: Object.assign(permission.toObject(), {
            _id: newId,
            resource: 'test-b'
          })
        }
      },
      {
        updateOne: {
          filter: { _id: permission._id },
          update: { resource: 'test-a' }
        }
      }
    ])
    const a = await models.Permission.findById(permission._id)
    const b = await models.Permission.findById(newId)
    expect(insertedCount).toBe(1)
    expect(modifiedCount).toBe(1)
    expect(a.resource).toBe('test-a')
    expect(b.resource).toBe('test-b')
  })
})
